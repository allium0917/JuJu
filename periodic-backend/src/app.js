import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import pool from "./db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 테스트용
app.post("/test/signin", (req, res) => {
    res.json({ message: "TEST SIGNIN OK" });
});

// 로그인 라우터
app.use("/api", authRouter);  // fetch('/api/signin')과 매칭

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});