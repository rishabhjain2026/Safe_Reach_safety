const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const contactRoutes = require("./contacts/contact.routes");
const placeRoutes = require("./places/place.routes");
const journeyRoutes = require("./journeys/journey.routes");
const trackingRoutes = require("./tracking/tracking.routes");
const notificationRoutes=require("./notifications/notification.routes")
const missedArrivalRoutes =require("./journey-intelligence/missed-arrival.routes");
const batteryRoutes =require("./battery/battery.routes");
const deviceRoutes =require("./device/device.routes");
const {startDeviceMonitorScheduler} = require("./scheduler/device-monitor.scheduler");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "SafeReach API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/journeys", journeyRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/missed-arrival",missedArrivalRoutes);
app.use("/api/battery",batteryRoutes);
app.use("/api/device",deviceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SafeReach server running on port ${PORT}`);
    startDeviceMonitorScheduler();
    
});