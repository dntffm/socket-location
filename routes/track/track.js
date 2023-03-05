const { Router } = require("express");
const db = require("../../models");
const { handleJwt } = require("../../utils/handleJwt");

const trackRouter = new Router()

trackRouter.post(
    '/book-ride', 
    handleJwt.verifyToken,
    async (req, res, next) => {
        const { user, body: { location } } = req

        const modelUser = await db.User.findOne({
            where: {
                role: 'driver'
            }
        })

        if (!user2)
            return res.status(404).send({
                success: false,
                message,
            });

        db.Geolocation.update(
            {
                trackerID: user.id,
                location: {
                type: "Point",
                coordinates: [location.longitude, location.latitude],
                },
                online: true,
            },
            {
                where: {
                    id: modelUser.id,
                },
                returning: true
            }
        )

        return res.status(200).send({
            success: true,
            message: "You have successfully been assigned a driver",
        });
    } 
)

module.exports = { route: trackRouter, name: 'track' }