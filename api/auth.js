// routes/auth.js
import express from "express";
import pool from "../periodic-backend/src/db.js";

const router = express.Router();

// ==================== 회원가입 ====================
router.post("/signup", async (req, res) => {
  const { uname, umail, upw } = req.body;

  try {
    const exist = await pool.query(
    "SELECT * FROM users WHERE umail = $1",
    [umail]
    );

    if (exist.rows.length > 0) {
      return res.json({
        success: false,
        message: "이미 존재하는 이메일입니다.",
      });
    }

    // 회원 저장
    const result = await pool.query(
      `INSERT INTO users (uname, umail, upw)
      VALUES ($1, $2, $3) RETURNING uid, uname, umail`,
      [uname, umail, upw]
    );

    return res.json({
      success: true,
      user: result.rows[0],
      token: "dummy-token", // JWT 필요하면 나중에 추가 가능
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// ==================== 로그인 ====================
router.post("/signin", async (req, res) => {
  const { umail, upw } = req.body;

  try {
    const result = await pool.query(
      "SELECT uid, uname, umail FROM users WHERE umail = $1 AND upw = $2", 
      [umail, upw]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    return res.json({
      success: true,
      user: result.rows[0],
      token: "dummy-token", // JWT 필요하면 나중에 추가 가능
    });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

export default router;