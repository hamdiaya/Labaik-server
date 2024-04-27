const notification=require('../models/notification');

// Function to handle sending notifications
const notification_controller={
    sendNotification : async (req, res) => {
        try {
            // Extract sender ID, receiver ID, and content from request body
            const { sender, receiverId, content } = req.body;
    
            // Insert notification into the 'notifications' table
            const data= await notification.createNotification(sender,receiverId,content);
           if(data=='Error creating notification:'||data=='error'){
            console.log(data)
            res.status(404).json('error while sending notification');
           }else{
   // Respond with success message or notification object
           res.status(200).json('notification sent');
           }
    
         
        } catch (error) {
            // Handle errors
            console.error('Error sending notification:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    fetchNotifications : async (req, res) => {
        try {
            // Extract receiver ID from request parameters
            const userId = req.decoded.userId;
    console.log(userId)
            // Fetch notifications for the specified receiver ID
           const notifications=await notification.fetchNotifications(userId);
           console.log(notifications)
       if(notifications== 'Error fetching notifications:'||notifications=='error'){
        res.status(404).json('error while fetching notifications');
       }
          
            // Respond with fetched notifications
            res.status(200).json(notifications);
        } catch (error) {
            // Handle errors
            console.error('Error fetching notifications:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    

}

module.exports=notification_controller;
