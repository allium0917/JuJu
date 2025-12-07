import express from "express";
import pool from "./db.js";

const router = express.Router();

// 최종 경로: /api/signin
router.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        user: result.rows[0],
        token: "dummy-token"
      });
    }

    return res.json({ success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." });

  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

export default router;