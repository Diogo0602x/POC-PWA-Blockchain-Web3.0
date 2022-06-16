package br.com.tarea.pocfhir.config.props;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GitProps {
    @Value("${git.uri}")
    private String uri;

    @Value("${git.branch}")
    private String branch;

    @Value("${git.tag:}")
    private String tag;

    @Value("${git.access-keys.passphrase:}")
    private String keyPassphrase;

    @Value("${git.access-keys.public}")
    private String keyPublic;
    
    @Value("${git.access-keys.private}")
    private String keyPrivate;

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("{\"uri\": \"");
        builder.append(uri);
        builder.append("\", \"branch\": \"");
        builder.append(branch);
        builder.append("\", \"tag\": \"");
        builder.append(tag);
        builder.append("\", \"keyPassphrase\": \"");
        builder.append(keyPassphrase);
        builder.append("\", \"keyPublic\": \"");
        builder.append(keyPublic);
        builder.append("\", \"keyPrivate\": \"");
        builder.append(keyPrivate);
        builder.append("\"}");
        return builder.toString();
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getKeyPassphrase() {
        return keyPassphrase;
    }

    public void setKeyPassphrase(String keyPassphrase) {
        this.keyPassphrase = keyPassphrase;
    }

    public String getKeyPublic() {
        return keyPublic;
    }

    public void setKeyPublic(String keyPublic) {
        this.keyPublic = keyPublic;
    }

    public String getKeyPrivate() {
        return keyPrivate;
    }

    public void setKeyPrivate(String keyPrivate) {
        this.keyPrivate = keyPrivate;
    }
}
