// src/routes/AITalk.js
import express from 'express';
import pool from '../periodic-backend/src/db.js';

const router = express.Router();

// /api/AITalk/:tid DELETE
router.delete('/:tid', async (req, res) => {
    try {
        const { tid } = req.params;

        if (!tid) {
            return res.status(400).json({ success: false, message: 'tid 누락' });
        }

        const query = `
            DELETE FROM ai_talk
            WHERE tid = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [tid]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: '삭제할 데이터 없음' });
        }

        res.json({ success: true, message: '삭제 완료', deleted: result.rows[0] });
    } catch (err) {
        console.error('❌ DB Delete 오류:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

// /api/AITalk?uid=6&type=question
router.get('/', async (req, res) => {
    try {
        const { uid, type } = req.query;

        if (!uid || !type) {
            return res.status(400).json({ success: false, message: 'uid나 type 누락' });
        }

        const allowedTypes = ['debate', 'question'];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ success: false, message: '유효하지 않은 type' });
        }

        const query = `
            SELECT tid, uid, topic, ai_response, created_at, talk_type
            FROM ai_talk
            WHERE uid = $1 AND talk_type = $2
            ORDER BY created_at DESC
        `;

        const result = await pool.query(query, [uid, type]);

        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('❌ DB Select 오류:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

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