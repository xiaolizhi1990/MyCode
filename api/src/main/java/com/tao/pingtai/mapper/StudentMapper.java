package com.tao.pingtai.mapper;

/**
 * Demo class
 *
 * @author keriezhang
 * @date 2016/10/31
 */
import com.tao.pingtai.entity.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface StudentMapper {

    /**
     *  查询所有学生信息
     * @return
     */
    @Select("SELECT * FROM student")
    List<Student> findAll();

}
