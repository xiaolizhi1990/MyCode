package com.tao.pingtai.controller;

import com.tao.pingtai.entity.Student;
import com.tao.pingtai.mapper.StudentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class HelloController {

    @Autowired
    private StudentMapper studentMapper;

    @RequestMapping(value="/hello", method= RequestMethod.GET)
    public String index() {
        return "Hello World";
    }

    @GetMapping("student")
    public Student student(){
        List<Student> list =  studentMapper.findAll();
        if( list != null && !list.isEmpty()){
            return list.get(0);
        }
        return null;
    }

}
