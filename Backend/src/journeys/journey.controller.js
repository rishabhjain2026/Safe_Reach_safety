const journeyService = require("./journey.service");

const createJourney = async (req, res) => {

    try {

        const journey = await journeyService.createJourney({
            userId: req.userId,
            originId: Number(req.body.originId),
            destinationId: Number(req.body.destinationId),
            plannedDeparture: req.body.plannedDeparture,
            expectedDuration: Number(req.body.expectedDuration)
        });

        return res.status(201).json({
            success: true,
            message: "Journey created successfully",
            data: journey
        });

    } catch (error) {

        console.error("Create journey error:", error);

        if (
            error.message === "Origin place not found" ||
            error.message === "Destination place not found" ||
            error.message ===
                "Origin and destination cannot be the same"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create journey"
        });
    }
};


const getJourneys = async (req, res) => {

    try {

        const journeys = await journeyService.getJourneys(
            req.userId
        );

        return res.status(200).json({
            success: true,
            data: journeys
        });

    } catch (error) {

        console.error("Get journeys error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch journeys"
        });
    }
};

const getJourneyById = async (req, res) => {

    try {

        const journeyId = Number(req.params.id);

        if (!Number.isInteger(journeyId) || journeyId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid journey ID"
            });
        }

        const journey = await journeyService.getJourneyById(
            journeyId,
            req.userId
        );

        return res.status(200).json({
            success: true,
            data: journey
        });

    } catch (error) {

        console.error("Get journey error:", error);

        if (error.message === "Journey not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch journey"
        });
    }
};

const updateJourney = async (req, res) => {

    try {

        const journeyId = Number(req.params.id);

        if (!Number.isInteger(journeyId) || journeyId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid journey ID"
            });
        }

        const journey = await journeyService.updateJourney(
            journeyId,
            req.userId,
            {
                originId:
                    req.body.originId !== undefined
                        ? Number(req.body.originId)
                        : undefined,

                destinationId:
                    req.body.destinationId !== undefined
                        ? Number(req.body.destinationId)
                        : undefined,

                plannedDeparture:
                    req.body.plannedDeparture,

                expectedDuration:
                    req.body.expectedDuration !== undefined
                        ? Number(req.body.expectedDuration)
                        : undefined
            }
        );

        return res.status(200).json({
            success: true,
            message: "Journey updated successfully",
            data: journey
        });

    } catch (error) {

        console.error("Update journey error:", error);

        if (
            error.message === "Journey not found" ||
            error.message ===
                "Only planned journeys can be updated" ||
            error.message ===
                "Origin and destination cannot be the same" ||
            error.message === "Origin place not found" ||
            error.message === "Destination place not found"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update journey"
        });
    }
};

const cancelJourney = async (req, res) => {

    try {

        const journeyId = Number(req.params.id);

        if (!Number.isInteger(journeyId) || journeyId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid journey ID"
            });
        }

        const journey = await journeyService.cancelJourney(
            journeyId,
            req.userId
        );

        return res.status(200).json({
            success: true,
            message: "Journey cancelled successfully",
            data: journey
        });

    } catch (error) {

        console.error("Cancel journey error:", error);

        if (
            error.message === "Journey not found" ||
            error.message ===
                "Only planned journeys can be cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to cancel journey"
        });
    }
};


module.exports = {
    createJourney,
    getJourneys,
    getJourneyById,
    updateJourney,
    cancelJourney
};