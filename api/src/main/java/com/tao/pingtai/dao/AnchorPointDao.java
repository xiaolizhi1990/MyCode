package com.tao.pingtai.dao;


import com.tao.pingtai.entity.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AnchorPointDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void findByName(String name) {
 /*       Query query = new Query(Criteria.where("name").is(name));
        AnchorPoint anchorPoint = mongoTemplate.findOne(query, AnchorPoint.class);*/
    /*    List<Test> list = mongoTemplate.findAll(Test.class);
        if(list != null && !list.isEmpty()){
            return list.get(0);
        }else{
            return  null;
        }*/
        Test test = new Test();
        test.setName("在");
        test.setId(UUID.randomUUID().toString());
        test.setAnchorPointId("10100011");
        mongoTemplate.insert(test);
    }
}
