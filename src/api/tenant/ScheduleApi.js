import { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/useUser";
import tenantApi from "../../api/tenant/tenantApi";

const useScheduleApi = ({
  propertyId,
  viewingId,
  viewingDate,
  notes,
  isImportant,
  onScheduleSuccess,
  onRescheduleSuccess,
  onCancelSuccess,
  onViewingsFetch,
  tenantId: propTenantId,
}) => {
  const { user, loading: userLoading } = useUser();
  const token = localStorage.getItem("token");
  const effectiveTenantId =
    propTenantId || user?.userId || user?.customId || "current-tenant-id";

  const [error, setError] = useState("");
  const hasFetched = useRef(false);
  const isProcessing = useRef(false);

  const handleApiCall = async (url, method, body = {}) => {
    if (isProcessing.current) return null;
    isProcessing.current = true;
    setError("");
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: new URLSearchParams(body),
      });
      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Unauthorized. Please log in.");
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      isProcessing.current = false;
    }
  };

  const scheduleViewing = async () => {
    if (!viewingDate) return;
    const now = new Date();
    const selectedDate = new Date(viewingDate);
    if (selectedDate <= now) {
      setError("Please select a future date and time.");
      return;
    }
    const data = await handleApiCall("/api/viewings/schedule", "POST", {
      propertyId,
      viewingDate,
      notes: notes || "",
      important: isImportant.toString(),
    });
    if (data && token) {
      onScheduleSuccess(data.message);
      try {
        const controller = new AbortController();
        await tenantApi.withRetry(
          tenantApi.fetchRecentActivity,
          [token, controller.signal],
          3,
          2000
        );
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      }
    }
  };

  const rescheduleViewing = async () => {
    if (!viewingDate) return;
    const now = new Date();
    const selectedDate = new Date(viewingDate);
    if (selectedDate <= now) {
      setError("Please select a future date and time.");
      return;
    }
    const data = await handleApiCall("/api/viewings/reschedule", "POST", {
      viewingId,
      viewingDate,
      notes: notes || "",
      important: isImportant.toString(),
    });
    if (data && token) {
      onRescheduleSuccess(data.message);
      try {
        const controller = new AbortController();
        await tenantApi.withRetry(
          tenantApi.fetchRecentActivity,
          [token, controller.signal],
          3,
          2000
        );
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      }
    }
  };

  const cancelViewing = async (viewingIdToCancel) => {
    const idToCancel = viewingIdToCancel || viewingId;
    if (!idToCancel) {
      setError("No viewing selected to cancel.");
      return;
    }
    if (window.confirm("Are you sure you want to cancel this viewing?")) {
      const data = await handleApiCall("/api/viewings/cancel", "POST", {
        viewingId: idToCancel,
      });
      if (data && token) {
        onCancelSuccess(data.message);
        try {
          await tenantApi.logActivity(
            token,
            {
              type: "VIEWING_CANCELED",
              message: `Canceled viewing ID ${idToCancel}`,
              entityId: idToCancel,
              landlordId: null,
            },
            new AbortController().signal
          );
          const controller = new AbortController();
          await tenantApi.withRetry(
            tenantApi.fetchRecentActivity,
            [token, controller.signal],
            3,
            2000
          );
        } catch (err) {
          console.error("Failed to log or fetch activity:", err);
        }
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchViewings = async () => {
      if (!mounted || userLoading || hasFetched.current) return;

      setError("");
      try {
        const url = `/api/viewings?tenantId=${effectiveTenantId}`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!response.ok) throw new Error("Failed to fetch viewings");
        const data = await response.json();
        onViewingsFetch(data);
        hasFetched.current = true;
      } catch (err) {
        setError(err.message || "Failed to load viewings");
      }
    };

    fetchViewings();

    return () => {
      mounted = false;
    };
  }, [effectiveTenantId, userLoading, onViewingsFetch, token]);

  useEffect(() => {
    let mounted = true;

    const fetchViewingDetails = async () => {
      if (!mounted || !viewingId || userLoading) return;
      setError("");
      try {
        const url = `/api/viewings/${viewingId}`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!response.ok) throw new Error("Viewing not found");
        const data = await response.json();
        onViewingsFetch({ viewings: [data.viewing] });
      } catch (err) {
        setError(err.message);
      }
    };

    if (viewingId) fetchViewingDetails();

    return () => {
      mounted = false;
    };
  }, [viewingId, onViewingsFetch, token, userLoading]);

  return {
    error,
    scheduleViewing,
    rescheduleViewing,
    cancelViewing,
  };
};

export default useScheduleApi;
