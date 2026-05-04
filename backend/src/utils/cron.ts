import cron from "node-cron";
import { db } from "../db";
import imagekit from "../config/imagekit";

// Run every hour to clean up expired files
export const initCronJob = () => {
    cron.schedule("0 * * * *", () => {
        console.log("Running cron job to clean up expired files...");
        
        const selectSql = "SELECT id, imagekit_id FROM files WHERE expires_at < NOW()";
        
        db.query(selectSql, (err, results: any[]) => {
            if (err) {
                console.error("Cron Error (SELECT):", err);
                return;
            }
            
            if (results.length === 0) {
                console.log("No expired files found.");
                return;
            }
            
            results.forEach((file) => {
                // 1. Delete from ImageKit if imagekit_id exists
                if (file.imagekit_id) {
                    imagekit.deleteFile(file.imagekit_id, (error) => {
                        if (error) {
                            console.error(`Failed to delete file ${file.imagekit_id} from ImageKit:`, error);
                        } else {
                            console.log(`Deleted file ${file.imagekit_id} from ImageKit.`);
                        }
                    });
                }
                
                // 2. Delete from Database
                const deleteSql = "DELETE FROM files WHERE id = ?";
                db.query(deleteSql, [file.id], (delErr) => {
                    if (delErr) {
                        console.error(`Failed to delete record ${file.id} from database:`, delErr);
                    } else {
                        console.log(`Deleted record ${file.id} from database.`);
                    }
                });
            });
        });
    });
};
