const supabase = require("../config/database");
// Function to create a new notification


const notification={
    createNotification:async(sender,sender_id, receiverId, content,agentUsername) =>{
        try {
                 // Insert notification into the 'notifications' table
            const { data, error } = await supabase
                .from('notifications')
                .insert([{ sender, receiver_id: receiverId, content,agent_username:agentUsername,sender_id:sender_id}]);
    
            if (error ) {
                console.log(error)
                return 'error';
            }
    
            return null;
        } catch (error) {
            console.error('Error creating notification:', error);
            return 'Error creating notification:';
        }
    },
    fetchNotifications:async(receiverId)=> {
        try {
            // Fetch notifications for the specified receiver ID
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('receiver_id', receiverId);
    
            if (error) {
                return "error";
            }
   
            return data;
        } catch (error) {
            console.error('Error fetching notifications:', error.message);
            return 'Error fetching notifications:';
        }
    },
    fetchNotificationsOfAgent:async(username)=> {
        try {
            // Fetch notifications for the specified receiver ID
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('agent_username', username);
    
            if (error) {
                return "error";
            }
   
            return data;
        } catch (error) {
            console.error('Error fetching notifications:', error.message);
            return 'Error fetching notifications:';
        }
    },
    makeNotificationSeen:async(notificationId)=>{
        try {
         
            const {data,error}=await supabase
            .from('notifications')
            .update({seen:true})
            .eq('id',notificationId);
         
            if(error){
                return 'error';
            }
            if(data!=null){
                return error;
            }
            return null;
        } catch (error) {
            return 'error';
        }
    }
}




module.exports=notification;
