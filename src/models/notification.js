const supabase = require("../config/database");
// Function to create a new notification


const notification={
    createNotification:async(sender, receiverId, content) =>{
        try {
            // Insert notification into the 'notifications' table
            const { data, error } = await supabase
                .from('notifications')
                .insert([{ sender, receiver_id: receiverId, content}]);
    
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
    }
}




module.exports=notification;
