package com.tao.pingtai.controller;

import com.tao.pingtai.exception.MyException;
import com.tao.pingtai.util.ErrorInfo;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
class GlobalExceptionHandler {
    private static String error = "error";

    @ExceptionHandler(value = Exception.class)
    public String defaultErrorHandler(Exception e) throws Exception {
        System.out.println("捕获到Exception异常....");
        return error;
    }

    @ExceptionHandler(value = RuntimeException.class)
    public String runtimeErrorHandler(RuntimeException re) throws Exception {
        System.out.println("捕获到RuntimeException异常....");
        return error;
    }


    @ExceptionHandler(value = MyException.class)
    @ResponseBody
    public ErrorInfo<String> jsonErrorHandler(HttpServletRequest req, MyException e) throws Exception {
        ErrorInfo<String> r = new ErrorInfo<>();
        r.setMessage(e.getMessage());
        r.setCode(ErrorInfo.ERROR);
        r.setData("Some Data");
        r.setUrl(req.getRequestURL().toString());
        return r;
    }


}