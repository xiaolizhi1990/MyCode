package com.tao.pingtai.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.JSONPath;
import com.tao.pingtai.entity.Student;
import com.tao.pingtai.exception.MyException;
import com.tao.pingtai.mapper.StudentMapper;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

/**
 * 使用@Controller走模板
 * 使用@RestController不走模板
 */
/*@Controller*/
/*@RestController*//*@RestController*/
public class TestController {

    @Autowired
    private StudentMapper studentMapper;

    @RequestMapping(value={""}, method= RequestMethod.GET)
    @ApiOperation(value="测试接口文档", notes="测试notes")
    public String index(ModelMap map){
        // 加入一个属性，用来在模板中读取
        map.addAttribute("host", "https://www.baidu.com");
        List<Student> list =  studentMapper.findAll();
        // return模板文件的名称，对应src/main/resorces/templates/index.html
        return "index";
    }

    /**
     * 在@Controller 注解中测试
     * @return
     */
    @GetMapping("student1")
    @ResponseBody
    public Student student(){
        List<Student> list =  studentMapper.findAll();
        if(list != null && list.size()>1){
            JSONArray array= JSONArray.parseArray(JSON.toJSONString(list));
            System.out.println(JSONPath.eval(array,"$[name='小法']"));
            return list.get(1);
        }
        return null;
    }

    @RequestMapping(value={"testerror"}, method= RequestMethod.GET)
    @ApiOperation(value="测试异常捕获", notes = "说明")
    public String testerror(ModelMap map) throws Exception{
       //throw new Exception ("发生错误");
       //throw new RuntimeException ("发生错误");
       throw new MyException("发生错误");
    }

    @RequestMapping(value={"/test/sendFileList"})
    public JSONObject sendFileList(@RequestBody JSONObject data) throws Exception{
        System.out.println("data = [" + data + "]");
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        return jsonObject;
    }

    @RequestMapping(value={"/test/getFile"})
    public JSONObject getFile() throws Exception{
        //获取地址
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        JSONArray jsonArray = new JSONArray();
        JSONObject fileEntity = new JSONObject();
        //fileEntity.put("fileName","D:\\2019电子发票\\订单5190404807900035电子发票-f-45276075.pdf");
        fileEntity.put("fileName","D:\\考生信息 - 副本.xlsx");
        fileEntity.put("taskid", "1991c2d2-d759-42b9-9304-e2ed4cf893f9");
        jsonArray.add(fileEntity);
        jsonObject.put("data",jsonArray);
       // System.out.println(UUID.randomUUID().toString());

        return jsonObject;
    }

    @RequestMapping(value={"/test/uploadFile"},method=RequestMethod.POST)
    @ResponseBody
    public JSONObject download(@RequestParam("file")MultipartFile file,String taskid) throws Exception{
        System.out.println("file = [" + file + "]");
        System.out.println("taskid = [" + taskid + "]");
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        return jsonObject;
    }

}