const validate = (schema) => {
    return async (req, res, next) => {
        console.log("BODY:", req.body);

        try {
            req.validatedData = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            console.error(error);

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues ?? [],
            });
        }
    };
};

export default validate;