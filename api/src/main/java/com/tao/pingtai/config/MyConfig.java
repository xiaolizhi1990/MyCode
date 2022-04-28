package com.tao.pingtai.config;


import com.tao.pingtai.interceptor.MyInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;


@Configuration
public class MyConfig  extends WebMvcConfigurationSupport {
    @Autowired
    private MyInterceptor myInterceptor;


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(myInterceptor)
                //addPathPatterns 用于添加拦截规则
                .addPathPatterns("/api/**");
        //excludePathPatterns 用于排除拦截
        //注意content-path：ding是不用填写的
        //项目启动测试接口
        // .excludePathPatterns("/")
        super.addInterceptors(registry);
    }


}
