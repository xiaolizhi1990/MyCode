package com.tao.pingtai;

import com.alibaba.fastjson.serializer.SerializerFeature;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.HttpMessageConverters;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
/*@ImportResource(locations = "classpath:dubbo-consumer.xml")*/
public class Application {

	public static void main(String[] args) {
		/*System.setProperty("socksProxySet", "true");
		System.setProperty("socksProxyHost", "172.31.53.32");
		System.setProperty("socksProxyPort", "31080");*/
		SpringApplication.run(Application.class, args);
	}

	/**
	 *
	 1.需要先定义一个convert转换消息的对象；
	 2.添加fastjson的配置信息，比如是否要格式化返回的json数据
	 3.在convert中添加配置信息
	 4.将convert添加到converters中
	 */
	@Bean
	public HttpMessageConverters fastJsonHttpMessageConverters() {

		FastJsonHttpMessageConverter fastConverter = new FastJsonHttpMessageConverter();

		FastJsonConfig fastJsonConfig = new FastJsonConfig();

		fastJsonConfig.setSerializerFeatures(SerializerFeature.PrettyFormat);

		fastConverter.setFastJsonConfig(fastJsonConfig);

		//3处理中文乱码问题
		List<MediaType> fastMediaTypes = new ArrayList<>();
		fastMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
		//4.在convert中添加配置信息.
		fastConverter.setSupportedMediaTypes(fastMediaTypes);

		HttpMessageConverter<?> converter = fastConverter;

		return new HttpMessageConverters(converter);

	}


}
