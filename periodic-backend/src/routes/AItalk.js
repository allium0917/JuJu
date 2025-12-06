// src/routes/AITalk.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/save', async (req, res) => {
    try {
        const { talk_type, topic, ai_response, uid } = req.body;

        if (!talk_type || !topic || !ai_response || !uid) {
            return res.status(400).json({ success: false, message: "필수 값 누락" });
        }

        const allowedTypes = ['debate', 'question'];
        if (!allowedTypes.includes(talk_type)) {
            return res.status(400).json({ success: false, message: "유효하지 않은 talk_type" });
        }

        const query = `
            INSERT INTO ai_talk (uid, topic, ai_response, talk_type)
            VALUES ($1, $2, $3, $4)
            RETURNING tid;
        `;

        const result = await pool.query(query, [
            uid,
            topic,
            ai_response,
            talk_type
        ]);

        res.json({
            success: true,
            tid: result.rows[0].tid
        });
    } catch (err) {
        console.error("❌ DB Insert 오류:", err);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
});

export default router;