package br.com.tarea.pocfhir.utils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.ServletContext;

public class FileUtil {
    public static String readFile(String filePath) throws IOException {
        StringBuilder fileContent = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {

            String sCurrentLine;
            while ((sCurrentLine = br.readLine()) != null) {
                fileContent.append(sCurrentLine + "\n");
            }

            return fileContent.toString();

        } catch (IOException e) {
            throw e;
        }
    }

    public static List<String> listFolder(String folderPath) throws IOException {

        try (Stream<Path> walk = Files.walk(Paths.get(folderPath))) {

            List<String> result = walk.filter(Files::isRegularFile)
                    .map(x -> x.toString()).collect(Collectors.toList());

            return result;

        } catch (IOException e) {
            throw e;
        }
    }

    public static void listFilesFromWar(ServletContext servletCtx, String from,
            final List<String> lsFiles) {
        Set<String> resourcePaths = servletCtx.getResourcePaths(from);
        if (resourcePaths != null) {
            for (String resourcePath : resourcePaths) {
                if (resourcePath.endsWith("/")) {
                    // this is a folder, let's copy it recursively
                    listFilesFromWar(servletCtx, resourcePath, lsFiles);
                } else {
                    lsFiles.add(resourcePath);
                }
            }
        }
    }
}
