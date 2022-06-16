package br.com.tarea.pocfhir.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.ListBranchCommand.ListMode;
import org.eclipse.jgit.api.TransportConfigCallback;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.InvalidRemoteException;
import org.eclipse.jgit.api.errors.TransportException;
import org.eclipse.jgit.lib.Ref;
import org.eclipse.jgit.transport.JschConfigSessionFactory;
import org.eclipse.jgit.transport.OpenSshConfig.Host;
import org.eclipse.jgit.transport.SshSessionFactory;
import org.eclipse.jgit.transport.SshTransport;
import org.eclipse.jgit.transport.Transport;
import org.eclipse.jgit.util.FS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

import br.com.tarea.pocfhir.config.props.GitProps;

/**
 * Interação com o repositório Git contendo as definições
 * FHIR da RNDS.
 */
@Service
public class GitService {

    private static final Logger LOG = LoggerFactory.getLogger(GitService.class);

    private final GitProps props;
    
    private Path _repoDir;

    public GitService(final GitProps props) {
        this.props = props;
        this._repoDir = null;
    }
    
    /**
     * URI de onde os arquivos estão ou serão baixados.
     * 
     * @return
     */
    public String getUri() {
    	return this.props.getUri();
    }
    
    /**
     * Diretório onde está, ou será, armazenada
     * a cópia local do repositório.
     * 
     * @return
     * 
     * @throws IOException 
     */
    public Path repoDir() throws IOException {
        if (_repoDir == null) {
            _repoDir = Files.createTempDirectory("fhir-profiles");
        }
        return _repoDir;
    }
    
    /**
     * Apaga, caso exista, a cópia local do repositório.
     */
    public void cleanLocalCopy() {
        try {
            if (repoDir().toFile().exists()) {
                FileUtils.deleteDirectory(repoDir().toFile());
            }
        } catch (IOException e) {
            LOG.debug(e.getMessage());
        }
    }
    
    /**
     * Recupera as propriedades de configuração do Git.
     * 
     * @return
     */
    public GitProps gitProps() {
        return this.props;
    }
    
    /**
     * Realiza o {@code describe} do repositório local.
     * 
     * @return
     * 
     * @throws GitAPIException
     * @throws IOException
     */
    public String describe() throws GitAPIException, IOException {
        return Git.open(repoDir().toFile()).describe().call();
    }
    
    /**
     * Realiza o clone e, quando necessário, o checkout das definições
     * FHIR do repositório Git.
     * 
     * @return
     * 
     * @throws IOException
     * @throws InvalidRemoteException
     * @throws TransportException
     * @throws GitAPIException
     */
    public Path pull() throws IOException, InvalidRemoteException, TransportException, GitAPIException {
        LOG.info( "*** Git Configs ----\n"
                + "   Git URI: {}\n    Branch: {}\n       Tag: {}\n Local dir: {}",
                props.getUri(), props.getBranch(), props.getTag(), repoDir() );
        
        final Git git;
        
        // realiza o clone da branch padrão
        if (props.getUri().startsWith("ssh://")) {
	        git = Git.cloneRepository()
                    .setURI(props.getUri())
                    .setDirectory(repoDir().toFile())
                    .setTransportConfigCallback(buildTransportConfig())
                    .setCloneAllBranches(true)
                    .call();
        } else if (props.getUri().startsWith("https://") || props.getUri().startsWith("http://")) {
        	git = Git.cloneRepository()
                    .setURI(props.getUri())
                    .setDirectory(repoDir().toFile())
                    .setCloneAllBranches(true)
                    .call();
        } else {
        	throw new RuntimeException(String.format("URI '%s' invalida.", props.getUri()));
        }
        
        // troca a branch
        if (StringUtils.isNotEmpty(props.getBranch())) {
            branch(git);
        }
        
        // recupera a tag
        if (StringUtils.isNotEmpty(props.getTag())) {
            tag(git);
        }
        return repoDir();
    }
    
    /**
     * Realiza o checkout da branch.
     * 
     * @param repo
     * 
     * @throws GitAPIException
     * @throws IOException
     */
    private void branch(final Git repo) throws GitAPIException, IOException {
        final List<Ref> lst = repo.branchList().setListMode(ListMode.ALL).call();
        
        if (lst == null) {
            LOG.error("no branches");
        } else if (!StringUtils.endsWith(repo.getRepository().getBranch(), props.getBranch())) {
            LOG.info("current branch '{}' differs from configured branch '{}' trying pull configured branch", 
                    repo.getRepository().getBranch(), props.getBranch());
            
            final Optional<Ref> ref = lst.stream().filter(item -> {
                return StringUtils.endsWith(item.getName(), props.getBranch());
            }).findFirst();
            
            if (ref.isPresent()) {
                repo.checkout()
                    .setCreateBranch(false)
                    .setName(ref.get().getName())
                    .call();
            } else {
                LOG.warn("branch with name '{}' not found, using default", props.getBranch());
            }
        }
    }
    
    /**
     * Configura a autenticação utilizando chaves SSH.
     * 
     * @return
     */
    private TransportConfigCallback buildTransportConfig() {
        final SshSessionFactory sshSessionFactory = new JschConfigSessionFactory() {
            @Override
            protected void configure(final Host hc, final Session session) {
                session.setConfig("StrictHostKeyChecking", "no");
            }

            @Override
            protected JSch createDefaultJSch(final FS fs) throws JSchException {
                final JSch defaultJSch = super.createDefaultJSch(fs);
                
                final byte[] priv = props.getKeyPrivate().getBytes(StandardCharsets.UTF_8);
                final byte[] pub = props.getKeyPublic().getBytes(StandardCharsets.UTF_8);
                
                final String passphrase = props.getKeyPassphrase();
                
                final byte[] pass;
                if (StringUtils.isEmpty(passphrase)) {
                    pass = new byte[0];
                } else {
                    pass = passphrase.getBytes(StandardCharsets.UTF_8);
                }
                
                defaultJSch.addIdentity("appkey", priv, pub, pass);
                
                return defaultJSch;
            }
        };

        return new TransportConfigCallback() {
            @Override
            public void configure(Transport transport) {
                final SshTransport sshTransport = (SshTransport) transport;
                sshTransport.setSshSessionFactory(sshSessionFactory);
            }
        };
    }
    
    /**
     * Realiza o checkout da tag.
     * 
     * @param repo
     * 
     * @throws GitAPIException
     * @throws IOException
     */
    private void tag(final Git repo) throws GitAPIException, IOException {
        final List<Ref> lst = repo.tagList().call();
        
        if (lst == null) {
            LOG.error("no tags");
        } else {
            Optional<Ref> ref = lst.stream().filter(item -> {
                return StringUtils.endsWith(item.getName(), props.getTag());
            }).findFirst();
            
            if (ref.isPresent()) {
                repo.checkout()
                    .setName(String.format("tag_%s", props.getTag()))
                    .setCreateBranch(true)
                    .setStartPoint(ref.get().getName())
                    .call();
            } else {
                LOG.warn("tag with name '{}' not found", props.getTag());
            }
        }
    }
}
