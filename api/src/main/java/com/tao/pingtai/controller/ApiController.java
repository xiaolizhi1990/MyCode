package com.tao.pingtai.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tao.pingtai.dao.AnchorPointDao;
import com.tao.pingtai.entity.Device;
import com.tao.pingtai.entity.DeviceDetail;
import com.tao.pingtai.entity.GroupDeviceDetail;
import com.tao.pingtai.entity.User;
import com.tao.pingtai.mapper.UserMapper;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

@RestController
@RequestMapping("api")
public class ApiController {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    HttpServletRequest request;
    @Autowired
    AnchorPointDao anchorPointDao;
    @Autowired
    private MongoTemplate mongoTemplate;

    public static String LOGIN_KEY = "pingtai_login_key";

    @RequestMapping(value = "/com.iflytek.edu.pdc.uc.service.basis.TermService", method = RequestMethod.POST)
    public String index(HttpServletRequest request) {
        System.out.println("request = [" + request + "]");
        return "Hello World";
    }

    @ApiOperation(value = "账户登录接口", notes = "通过用户名和密码登陆")
    @RequestMapping(value = "/login")
    public JSONObject login(String username, String password) {
        Query query = new Query(Criteria.where("username").is(username).and("password").is(password));
        JSONObject user = mongoTemplate.findOne(query,JSONObject.class,"testuser");
       // User user = userMapper.find(username, password);
        JSONObject jsonObject = new JSONObject();
        if (user != null) {
            request.getSession().setAttribute(LOGIN_KEY, user);
            jsonObject.put("code", 0);
            jsonObject.put("msg", "success");
        } else {
            jsonObject.put("code", 1);
            jsonObject.put("msg", "fail");
        }
        return jsonObject;
    }

    @ApiOperation(value = "账户登录接口", notes = "通过用户名和密码登陆")
    @RequestMapping(value = "/addUser")
    public JSONObject addUser(String username, String password) {
        JSONObject jsonObject = new JSONObject();
        if(!StringUtils.isEmpty(username)){
            jsonObject.put("username",username);
            jsonObject.put("password",password);
            mongoTemplate.insert(jsonObject,"testuser");
        }
        return jsonObject;
    }

    @ApiOperation(value = "校验登陆状态", notes = "校验当前用户是否登录")
    @GetMapping(value = "/checkLogin")
    public JSONObject checkLogin() {
        JSONObject jsonObject = new JSONObject();
        Object obj = request.getSession().getAttribute(LOGIN_KEY);
        if (obj != null) {
            jsonObject.put("code", 0);
            jsonObject.put("msg", "success");
            jsonObject.put("data", obj);
        } else {
            jsonObject.put("code", 1);
            jsonObject.put("msg", "fail");
        }
        return jsonObject;
    }

    @ApiOperation(value = "登录退出接口", notes = "注销登录状态接口")
    @GetMapping(value = "/loginOut")
    public JSONObject loginOut() {
        JSONObject jsonObject = new JSONObject();
        request.getSession().removeAttribute(LOGIN_KEY);
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        return jsonObject;
    }

    @ApiOperation(value = "接收数据", notes = "接收数据")
    @PostMapping(value = "/collection")
    public JSONObject collection(@RequestBody Device device) {
        mongoTemplate.insert(device);
        JSONArray data = device.getData();
        String datatime = device.getDatatime();
        JSONObject result = new JSONObject();
        result.put("result", 0);
        if (data != null) {
            int size = data.size();
            JSONObject jsonObject;
            long currenttime = System.currentTimeMillis();
            for (int i = 0; i < size; i++) {
                jsonObject = data.getJSONObject(i);
                DeviceDetail deviceDetail = new DeviceDetail();
                deviceDetail.setDid(device.getId());
                deviceDetail.setDevid(jsonObject.getString("devid"));
                deviceDetail.setPort(jsonObject.getString("port"));
                deviceDetail.setVal(jsonObject.getJSONArray("val"));
                deviceDetail.setDatatime(datatime);
                deviceDetail.setCurrenttime(currenttime);
                mongoTemplate.insert(deviceDetail);
            }
            result.put("total", size);
            result.put("success", size);
            result.put("error", 0);
        } else {
            result.put("total", 1);
            result.put("success", 0);
            result.put("error", 1);
        }
        return result;
    }

    @ApiOperation(value = "设备接收信息列表")
    @GetMapping(value = "/collection")
    public JSONObject collection() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        jsonObject.put("data", mongoTemplate.findAll(Device.class));
        return jsonObject;
    }

    @ApiOperation(value = "根据时间来搜索")
    @GetMapping(value = "/searchDevice")
    public JSONObject searchDevice(String devid, String start, String end) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        //错误写法
        //Query query = new Query(Criteria.where("devid").is(devid).and("datatime").gte(start).and("datatime").lt(end));
        //字段不重复可以
        //Query query = new Query(Criteria.where("devid").is(devid).and("datatime").gte(start));
        Criteria criteria = new Criteria();
        if(StringUtils.isEmpty(start)||StringUtils.isEmpty(end)){
            criteria.andOperator(
                    Criteria.where("devid").is(devid)
            );
        }else{
            criteria.andOperator(
                    Criteria.where("devid").is(devid),
                    Criteria.where("datatime").gte(start),
                    Criteria.where("datatime").lte(end)
            );
        }

        Query query = new Query(criteria);

        //query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "datatime")));
        query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "currenttime")));
        query.limit(1000);
        List<DeviceDetail> list = mongoTemplate.find(query, DeviceDetail.class);
        jsonObject.put("data", list);
        return jsonObject;
    }

    @ApiOperation(value = "设备详细列表,根据deviceId")
    @GetMapping(value = "/deviceList")
    public JSONObject deviceList(String name) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");

      /*  //完全匹配
        Pattern pattern = Pattern.compile("^张$", Pattern.CASE_INSENSITIVE);
        //右匹配
        Pattern pattern = Pattern.compile("^.*张$", Pattern.CASE_INSENSITIVE);
        //左匹配
        Pattern pattern = Pattern.compile("^张.*$", Pattern.CASE_INSENSITIVE);*/
        if (StringUtils.isEmpty(name)) {
            name = "";
        }
        //模糊匹配
        Pattern pattern = Pattern.compile("^.*" + name + ".*$", Pattern.CASE_INSENSITIVE);

        TypedAggregation<GroupDeviceDetail> agg = Aggregation.newAggregation(GroupDeviceDetail.class,
                group("devid").first("id").as("devid")
                        .count().as("allNum"),
                Aggregation.match(Criteria.where("_id").regex(pattern))
                //,sort(Sort.Direction.DESC, "datatime")
        );
        //System.out.println(agg.toString());
        AggregationResults<GroupDeviceDetail> result = mongoTemplate.aggregate(agg, GroupDeviceDetail.class);
        //result.getMappedResults().forEach(document -> System.out.println(document));

        //jsonObject.put("data", mongoTemplate.findAll(DeviceDetail.class));
        // result.getMappedResults().forEach(document -> System.out.println(document));
        jsonObject.put("data", result.getMappedResults());
        return jsonObject;
    }

    @ApiOperation(value = "根据deviceId查询")
    @GetMapping(value = "/queryBydevId")
    public JSONObject queryBydevId(String id) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        Query query = new Query(Criteria.where("devid").is(id));
        query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "currenttime")));
        query.limit(5);
        List<DeviceDetail> list = mongoTemplate.find(query, DeviceDetail.class);
        jsonObject.put("data", list);
        return jsonObject;
    }

    @RequestMapping(value = "/deviceManager", method ={RequestMethod.POST})
    public JSONObject deviceManager(@RequestBody JSONObject data) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        if(data !=null && data.getString("type") != null){
            String type = data.getString("type");
            if("add".equals(type)){
                data.remove("type");
                data.put("createTime",new Date());
                data.put("uuid",UUID.randomUUID().toString().replace("-",""));
                mongoTemplate.insert(data,"deviceManager");
            }else if("update".equals(type)){
                String uuid = data.getString("uuid");
                Criteria criteria = new Criteria();
                if(!StringUtils.isEmpty(uuid)){
                    criteria.andOperator(
                            Criteria.where("uuid").is(uuid)
                    );
                    Query query = new Query(criteria);
                    mongoTemplate.remove(query,"deviceManager");
                }

                data.remove("type");
                data.put("createTime",new Date());
                data.put("uuid",UUID.randomUUID().toString().replace("-",""));
                mongoTemplate.insert(data,"deviceManager");
            }else if("delete".equals(type)){
                String uuid = data.getString("uuid");
                Criteria criteria = new Criteria();
                if(!StringUtils.isEmpty(uuid)){
                    criteria.andOperator(
                            Criteria.where("uuid").is(uuid)
                    );
                }
                Query query = new Query(criteria);
                mongoTemplate.remove(query,"deviceManager");
            }else if("get".equals(type)){
                String uuid = data.getString("uuid");
                Criteria criteria = new Criteria();
                if(!StringUtils.isEmpty(uuid)){
                    criteria.andOperator(
                            Criteria.where("uuid").is(uuid)
                    );
                    Query query = new Query(criteria);
                    JSONObject json = mongoTemplate.findOne(query,JSONObject.class,"deviceManager");
                    jsonObject.put("data", json);
                }
            }else if("search".equals(type)){
                Criteria criteria = new Criteria();
                String deviceName = data.getString("deviceName");
                if(!StringUtils.isEmpty(deviceName)){
                    Pattern pattern = Pattern.compile("^.*" + deviceName + ".*$", Pattern.CASE_INSENSITIVE);
                    criteria.andOperator(
                            Criteria.where("deviceName").regex(pattern)
                    );
                }

                Query query = new Query(criteria);

                query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "createTime")));
                query.limit(100);
                List<JSONObject> list = mongoTemplate.find(query,JSONObject.class,"deviceManager");
                if(list != null && !list.isEmpty()){
                    for (JSONObject json:list) {
                        //json.put("di",json.get("_id"));
                        json.remove("_id");
                    }
                    jsonObject.put("data", list);
                }
                //jsonObject.put("data", list);
            }
        }
        return jsonObject;
    }

    @RequestMapping(value = "/projectManager", method ={RequestMethod.POST})
    public JSONObject projectManager(@RequestBody JSONObject data) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        if(data !=null && data.getString("type") != null){
            String type = data.getString("type");
            if("add".equals(type)){
                data.remove("type");
                data.put("createTime",new Date());
                data.put("uuid",UUID.randomUUID().toString().replace("-",""));
                mongoTemplate.insert(data,"projectManager");
            }else if("update".equals(type)){
                String uuid = data.getString("uuid");
                Criteria criteria = new Criteria();
                if(!StringUtils.isEmpty(uuid)){
                    criteria.andOperator(
                            Criteria.where("uuid").is(uuid)
                    );
                    Query query = new Query(criteria);
                    mongoTemplate.remove(query,"projectManager");
                }

                data.remove("type");
                data.put("createTime",new Date());
                data.put("uuid",UUID.randomUUID().toString().replace("-",""));
                mongoTemplate.insert(data,"projectManager");
            }else if("delete".equals(type)){
                String uuid = data.getString("uuid");
                Criteria criteria = new Criteria();
                if(!StringUtils.isEmpty(uuid)){
                    criteria.andOperator(
                            Criteria.where("uuid").is(uuid)
                    );
                }
                Query query = new Query(criteria);
                mongoTemplate.remove(query,"projectManager");
            }else if("get".equals(type)){
                String uuid = data.getString("uuid");
                Criteria criteria = new Criteria();
                if(!StringUtils.isEmpty(uuid)){
                    criteria.andOperator(
                            Criteria.where("uuid").is(uuid)
                    );
                    Query query = new Query(criteria);
                    JSONObject json = mongoTemplate.findOne(query,JSONObject.class,"projectManager");
                    jsonObject.put("data", json);
                }
            }else if("search".equals(type)){
                Criteria criteria = new Criteria();
                String deviceName = data.getString("ProjectName");
                if(!StringUtils.isEmpty(deviceName)){
                    Pattern pattern = Pattern.compile("^.*" + deviceName + ".*$", Pattern.CASE_INSENSITIVE);
                    criteria.andOperator(
                            Criteria.where("ProjectName").regex(pattern)
                    );
                }

                Query query = new Query(criteria);

                query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "createTime")));
                query.limit(100);
                List<JSONObject> list = mongoTemplate.find(query,JSONObject.class,"projectManager");
                if(list != null && !list.isEmpty()){
                    for (JSONObject json:list) {
                        //json.put("di",json.get("_id"));
                        json.remove("_id");
                    }
                    jsonObject.put("data", list);
                }
                //jsonObject.put("data", list);
            }
        }
        return jsonObject;
    }

    @RequestMapping(value = "/monitoringProgramme", method ={RequestMethod.POST})
    public JSONObject monitoringProgramme(@RequestBody JSONObject data) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        if(data !=null && data.getString("type") != null){
            String type = data.getString("type");
            if("add".equals(type)){
                data.remove("type");
                data.put("createTime",new Date());
                data.put("uuid",UUID.randomUUID().toString().replace("-",""));
                mongoTemplate.insert(data,"monitoringProgramme");
            }else if("update".equals(type)){
                String uuid = data.getString("uuid");
                Criteria criteria = new Criteria();
                if(!StringUtils.isEmpty(uuid)){
                    criteria.andOperator(
                            Criteria.where("uuid").is(uuid)
                    );
                    Query query = new Query(criteria);
                    mongoTemplate.remove(query,"monitoringProgramme");
                }

                data.remove("type");
                data.put("createTime",new Date());
                data.put("uuid",UUID.randomUUID().toString().replace("-",""));
                mongoTemplate.insert(data,"monitoringProgramme");
            }else if("delete".equals(type)){
                String uuid = data.getString("uuid");
                Criteria criteria = new Criteria();
                if(!StringUtils.isEmpty(uuid)){
                    criteria.andOperator(
                            Criteria.where("uuid").is(uuid)
                    );
                }
                Query query = new Query(criteria);
                mongoTemplate.remove(query,"monitoringProgramme");
            }else if("get".equals(type)){
                String uuid = data.getString("uuid");
                Criteria criteria = new Criteria();
                if(!StringUtils.isEmpty(uuid)){
                    criteria.andOperator(
                            Criteria.where("uuid").is(uuid)
                    );
                    Query query = new Query(criteria);
                    JSONObject json = mongoTemplate.findOne(query,JSONObject.class,"monitoringProgramme");
                    jsonObject.put("data", json);
                }
            }else if("search".equals(type)){
                Criteria criteria = new Criteria();
                String deviceName = data.getString("ProjectName");
                if(!StringUtils.isEmpty(deviceName)){
                    Pattern pattern = Pattern.compile("^.*" + deviceName + ".*$", Pattern.CASE_INSENSITIVE);
                    criteria.andOperator(
                            Criteria.where("ProjectName").regex(pattern)
                    );
                }

                Query query = new Query(criteria);

                query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "createTime")));
                query.limit(100);
                List<JSONObject> list = mongoTemplate.find(query,JSONObject.class,"monitoringProgramme");
                if(list != null && !list.isEmpty()){
                    for (JSONObject json:list) {
                        //json.put("di",json.get("_id"));
                        json.remove("_id");
                    }
                    jsonObject.put("data", list);
                }
                //jsonObject.put("data", list);
            }
        }
        return jsonObject;
    }

    @GetMapping(value = "/testMongoDb")
    public JSONObject testMongoDb(String name) {
        JSONObject jsonObject = new JSONObject();
        request.getSession().removeAttribute(LOGIN_KEY);
        jsonObject.put("code", 0);
        jsonObject.put("msg", "success");
        anchorPointDao.findByName(name);
        // jsonObject.put("data", anchorPointDao.findByName(name));
        return jsonObject;
    }

}
