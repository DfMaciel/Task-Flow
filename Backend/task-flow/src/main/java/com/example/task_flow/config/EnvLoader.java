// package com.example.task_flow.config;

// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.util.List;

// public class EnvLoader {
//     public static void loadEnv() {
//         Path envPath = Paths.get(".env").toAbsolutePath();
//         try {
//             List<String> lines = Files.readAllLines(envPath);
//             for (String line : lines) {
//                 if (line.trim().isEmpty() || line.trim().startsWith("#")) continue;
//                 String[] parts = line.split("=", 2);
//                 if (parts.length == 2) {
//                     String key = parts[0].trim();
//                     String value = parts[1].trim();
//                     System.setProperty(key, value);
//                 }
//             }
//         } catch (IOException e) {
//             System.err.println("Erro ao carregar .env: " + e.getMessage());
//         }
//     }
// }
