package com.example.task_flow;

// import com.example.task_flow.config.EnvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskFlowApplication {

	public static void main(String[] args) {
		// EnvLoader.loadEnv();
		SpringApplication.run(TaskFlowApplication.class, args);
	}

}
