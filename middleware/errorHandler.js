export const errorHandler = (err, req, res, next) => {
    console.error("Global Error Handler:", err);

    // Default error status and message
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle Mongoose/MongoDB ObjectId errors or others if needed
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Resource not found or invalid ID format';
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};
