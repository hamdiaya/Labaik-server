const notification = require("../models/notification");
const supabase = require("../config/database");
// Function to handle sending notifications
const notification_controller = {
  sendNotificationToASpecificCandidate: async (req, res) => {
    try {
      // Extract sender ID, receiver ID, and content from request body
      const { sender, receiverId, content } = req.body;
      // Insert notification into the 'notifications' table
      const data = await notification.createNotification(
        sender,
        null,
        receiverId,
        content,
        null
      );
      if (data == "Error creating notification:" || data == "error") {
        console.log(data);
        res.status(404).json("error while sending notification");
      } else {
        // Respond with success message or notification object
        res.status(200).json("notification sent");
      }
    } catch (error) {
      // Handle errors
      console.error("Error sending notification:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  sendQuestionToAgent: async (req, res) => {
    try {
      const sender_id = req.decoded.userId;

      const { sender, commune, content } = req.body;
      // Insert notification into the 'notifications' table
      const data = await notification.createNotification(
        sender,
        sender_id,
        null,
        content,
        commune
      );
      if (data == "Error creating notification:" || data == "error") {
        console.log(data);
        res.status(404).json("error while sending notification");
      } else {
        // Respond with success message or notification object
        res.status(200).json("notification sent");
      }
    } catch (error) {
      // Handle errors
      console.error("Error sending notification:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  sendNotificationToCommuneCandidates: async (req, res) => {
    try {
      // Extract sender ID and content from request body
      const { sender, content } = req.body;
      const agentUsername = req.decoded.username;

      // Fetch all candidate IDs from the 'duplicated_candidates' table belonging to the commune
      const { data: communeCandidates, error } = await supabase
        .from("candidats_duplicate")
        .select("id")
        .eq("commune_résidence", agentUsername);

      // Check for errors in fetching commune candidates
      if (error) {
        console.error("Error fetching commune candidates:", error.message);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Send notification to each commune candidate
      const notificationsSent = await Promise.all(
        communeCandidates.map(async (candidate) => {
          const receiverId = candidate.id;
          return await notification.createNotification(
            sender,
            null,
            receiverId,
            content,
            null
          );
        })
      );

      // Check if any notification failed to send
      if (
        notificationsSent.some(
          (notification) =>
            notification === "Error creating notification:" ||
            notification === "error"
        )
      ) {
        console.log("Error while sending notifications");
        res.status(500).json({ error: "Error while sending notifications" });
      } else {
        // Respond with success message
        res.status(200).json("Notifications sent to all commune candidates");
      }
    } catch (error) {
      // Handle errors
      console.error("Error sending commune notifications:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  sendNotificationToAgents: async (req, res) => {
    try {
      // Extract sender ID and content from request body
      const { sender, content } = req.body;

      // Fetch all candidate IDs from the 'duplicated_candidates' table belonging to the commune
      const { data: agents, error } = await supabase
        .from("agents")
        .select("username");

      // Check for errors in fetching commune candidates
      if (error) {
        console.error("Error fetching commune candidates:", error.message);
        return res.status(500).json({ error: "Internal server error" });
      }

      const { default: pLimit } = await import("p-limit");
      const limit = pLimit(80);
      // Send notification to each commune candidate
      const requests = agents.map((agent) =>
        limit(() =>
          notification.createNotification(
            sender,
            null,
            null,
            content,
            agent.username
          )
        )
      );

      const notificationsSent = await Promise.all(requests);

      // Check if any notification failed to send
      if (
        notificationsSent.some(
          (notification) =>
            notification === "Error creating notification:" ||
            notification === "error"
        )
      ) {
        console.log("Error while sending notifications");
        res.status(500).json({ error: "Error while sending notifications" });
      } else {
        // Respond with success message
        res.status(200).json("Notifications sent to all commune candidates");
      }
    } catch (error) {
      // Handle errors
      console.error("Error sending commune notifications:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  fetchNotifications: async (req, res) => {
    try {
      // Extract receiver ID from request parameters
      const userId = req.decoded.userId;
      // Fetch notifications for the specified receiver ID
      const notifications = await notification.fetchNotifications(userId);

      if (
        notifications == "Error fetching notifications:" ||
        notifications == "error"
      ) {
        res.status(404).json("error while fetching notifications");
      }

      // Respond with fetched notifications
      res.status(200).json(notifications);
    } catch (error) {
      // Handle errors
      console.error("Error fetching notifications:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  fetchNotificationOfAgent: async (req, res) => {
    try {
      const agentUsername = req.decoded.username;
      const notifications =
        await notification.fetchNotificationsOfAgent(agentUsername);

      if (
        notifications == "Error fetching notifications:" ||
        notifications == "error"
      ) {
        res.status(404).json("error while fetching notifications");
      }

      // Respond with fetched notifications
      res.status(200).json(notifications);
    } catch (error) {
      res.status(404).json("error while fetching notifications");
    }
  },
  makeNotificationSeen: async (req, res) => {
    try {
      const { id } = req.body;
      const data = await notification.makeNotificationSeen(id);
      if (data == null) {
        res.status(200).json("notification state changed ");
      } else {
        res.status(404).json("error changing notification state ");
      }
    } catch (error) {
      res.status(404).json("error changing notification state ");
    }
  },
};

module.exports = notification_controller;
