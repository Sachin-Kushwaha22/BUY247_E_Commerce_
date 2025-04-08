const pool = require('../config/database');

exports.uploadProfilePic = async (req, res) => {
    try {
        const id = req.user.id;
        const profilePicUrl = req.file.path;

        if (!profilePicUrl) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Update profile pic in database
        const query = 'UPDATE users SET profilepic = $1 WHERE id = $2';
        const result = await pool.query(query, [profilePicUrl, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        return res.status(200).json({ message: 'Profile picture updated', profilePic: profilePicUrl });
    } catch (error) {
        console.log('error from uploadProfilePicture', error);
        return res.status(500).json({ message: 'Server error while uploading profile picture' });
    }
};


exports.getProfilePic = async (req, res) => {
    try {
        const id = req.user.id;


        // Update profile pic in database
        const query = 'select profilepic from users WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if(result.rows[0].profilepic === null){
            return res.status(404).json({ message: 'No profile picture found' });
        }

        return res.status(200).json({ message: 'Profile picture ', profilePic: result.rows[0].profilepic });
    } catch (error) {
        console.log('error from uploadProfilePicture', error);
        return res.status(500).json({ message: 'Server error while uploading profile picture' });
    }
} 

exports.deleteProfilePic = async(req, res) => {
    try {
        const id = req.user.id;


        // Update profile pic in database
        const query = 'UPDATE users SET profilepic = null WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        return res.status(200).json({ message: 'Profile picture deleted'});
    } catch (error) {
        console.log('error from deleteProfilePicture', error);
        return res.status(500).json('Server error while deleting profile picture');
    }
}