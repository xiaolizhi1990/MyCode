package com.tao.pingtai.mapper;


import com.tao.pingtai.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {


    @Select({"<script>",
            "SELECT id,username FROM user",
            "WHERE 1=1",
            "<when test='un !=null'>",
            "AND username = #{un}",
            "</when>",
            "<when test='ps!=null'>",
            "AND password = #{ps}",
            "</when>",
            "</script>"})
    User find(@Param("un") String username, @Param("ps") String password);

}
