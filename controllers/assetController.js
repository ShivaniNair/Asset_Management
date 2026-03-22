const db = require("../config/db");

exports.claimAsset = async (req, res) => {
    const userId = req.user.id;
    const assetId = req.params.id;

    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
        const [rows] = await conn.query(
            "SELECT * FROM assets WHERE id=? FOR UPDATE",
            [assetId]
        );

        const asset = rows[0];

        if (!asset) {
            throw new Error("Invalid Coupen");
        }
        if (asset.status !== "AVAILABLE") {
            throw new Error("Already claimed");
        }

        await conn.query(
            "UPDATE assets SET status='CLAIMED', claimed_by=? WHERE id=?",
            [userId, assetId]
        );

        await conn.query(
            "INSERT INTO asset_logs (asset_id, user_id, action) VALUES (?, ?, 'CLAIM')",
            [assetId, userId]
        );

        await conn.commit();
        res.json({ message: "Asset claimed successfully" });

    } catch (err) {
        await conn.rollback();
        res.status(400).json({ message: err.message });
    } finally {
        conn.release();
    }
};

exports.getAssets = async (req, res) => {
    const [rows] = await db.query(`
        SELECT a.id, a.code, a.status, u.name AS claimed_by
        FROM assets a
        LEFT JOIN users u ON a.claimed_by = u.id
    `);

    res.json(rows);
};
exports.getMyAssets = async (req, res) => {
    const userId = req.user.id;

    const [rows] = await db.query(`
        SELECT a.code, l.action, l.created_at
        FROM asset_logs l
        JOIN assets a ON a.id = l.asset_id
        WHERE l.user_id = ?
    `, [userId]);

    res.json(rows);
};