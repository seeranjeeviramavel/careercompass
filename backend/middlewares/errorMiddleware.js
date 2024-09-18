const errorMiddleWare = (err, req, res, next) => {
    const defaultError ={
        statusCode: 500,
        success: false,
        error : err.message || "Something went wrong",
        errorMessage: err.stack,
        status : err.status || 500,
    }
    if(err.name === "ValidationError"){
        defaultError.statusCode = 400;
        defaultError.success = false;
        defaultError.message = Object.values(err.errors).map((item) => item.message).join(",");
    }

    if(err.code && err.code===11000){
        defaultError.statusCode = 400;
        defaultError.success = false;
        defaultError.message = "Duplicate Entry";
    }
    res.status(defaultError.statusCode).json(defaultError);
}
export default errorMiddleWare;