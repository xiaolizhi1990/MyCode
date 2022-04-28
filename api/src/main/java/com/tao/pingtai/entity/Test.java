package com.tao.pingtai.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

//@Document(collection = "Test")
public class Test implements Serializable {

    @Id
    private String id;

    private String anchorPointId;

    private  String name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAnchorPointId() {
        return anchorPointId;
    }

    public void setAnchorPointId(String anchorPointId) {
        this.anchorPointId = anchorPointId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
