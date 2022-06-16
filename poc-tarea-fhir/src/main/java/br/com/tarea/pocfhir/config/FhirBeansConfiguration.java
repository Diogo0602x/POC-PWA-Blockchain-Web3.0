package br.com.tarea.pocfhir.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.hl7.fhir.common.hapi.validation.support.CachingValidationSupport;
import org.hl7.fhir.common.hapi.validation.support.InMemoryTerminologyServerValidationSupport;
import org.hl7.fhir.common.hapi.validation.support.PrePopulatedValidationSupport;
import org.hl7.fhir.common.hapi.validation.support.SnapshotGeneratingValidationSupport;
import org.hl7.fhir.common.hapi.validation.support.ValidationSupportChain;
import org.hl7.fhir.common.hapi.validation.validator.FhirInstanceValidator;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.CodeSystem;
import org.hl7.fhir.r4.model.StructureDefinition;
import org.hl7.fhir.r4.model.ValueSet;
import org.hl7.fhir.r5.utils.IResourceValidator.BestPracticeWarningLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import br.com.tarea.pocfhir.model.defs.FhirDef;
import br.com.tarea.pocfhir.model.defs.FhirDefType;
import br.com.tarea.pocfhir.service.GitService;
import br.com.tarea.pocfhir.utils.FileUtil;
import br.com.tarea.pocfhir.utils.XmlUtilities;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.context.support.DefaultProfileValidationSupport;
import ca.uhn.fhir.fhirpath.IFhirPath;
import ca.uhn.fhir.parser.IParser;
import ca.uhn.fhir.rest.api.EncodingEnum;
import ca.uhn.fhir.validation.FhirValidator;

@Configuration
public class FhirBeansConfiguration {
    private static final Logger LOG = LoggerFactory.getLogger(FhirBeansConfiguration.class);

    private static final String FHIR_BASE_DEF = "http://hl7.org/fhir/StructureDefinition/";
    private static final String ON_WAR_BASE_PATH = "/WEB-INF/classes";
    private static final String SRC_BASE_PATH = "src/main/resources";

    private final ServletContext servletCtx;
    
    /**
     * Interação com o repositório Git contendo
     * os arquivos de profile.
     */
    private final GitService gitsvc;
    
    /**
     * Construtor.
     * 
     * @param servletCtx
     * @param gitsvc
     */
    public FhirBeansConfiguration(final ServletContext servletCtx, final GitService gitsvc) {
        this.servletCtx = servletCtx;
        this.gitsvc = gitsvc;
    }
    
	@Bean
	public FhirContext fhirContext() {
		return FhirContext.forR4();
	}

	@Bean
	public IFhirPath iFhirPath() {
		return fhirContext().newFhirPath();
	}
	
	@Bean
	public FhirInstanceValidator getFhirInstanceValidator(final FhirContext ctx) throws Exception {
        // DefaultProfileValidationSupport supplies base FHIR definitions. This is generally
        // required even if you are using custom profiles, since those profiles will derive from
        // the base definitions.
        final DefaultProfileValidationSupport defaultSupport = new DefaultProfileValidationSupport(ctx);

        // Create a PrePopulatedValidationSupport which will be used to load custom definitions.
        final PrePopulatedValidationSupport ppSupport = new PrePopulatedValidationSupport(ctx);
        
        final String location;
        final boolean fromClasspath;
        
        final List<List<FhirDef>> resources;
        
        final String profilesLocation = gitsvc.getUri();
        
        if ("git".equalsIgnoreCase(profilesLocation)) {
            location = gitsvc.pull().toFile().getAbsolutePath();
            resources = load(location, null, false);
            fromClasspath = false;
        } else if (StringUtils.startsWithIgnoreCase(profilesLocation, "file:")) {
            location = StringUtils.substringAfter(profilesLocation, ":");
            resources = load(location, null, false);
            fromClasspath = false;
        } else {
            location = profilesLocation;
            resources = load(location, servletCtx, true);
            fromClasspath = true;
        }
        
        LOG.info("profiles location: {}", location);
        
        // load resources

        for (final List<FhirDef> lsitem : resources) {
            for (FhirDef item : lsitem) {
                LOG.debug("\n  ->             URL: {}"
                        + "\n  -> Base Definition: {} "
                        + "\n  ->            Type: {}"
                        + "\n  ->            Path: {}"
                        + "\n  ->         Version: {}",
                        item.getUrl(),
                        item.getBaseDefinition(),
                        item.getType(),
                        item.getFilePath(),
                        item.getVersion());

                String sdPath = item.getFilePath();

                if (FhirDefType.CODE_SYSTEM.equals(item.getType())) {
                    CodeSystem codeSystem =
                            loadResourceFromClasspath(CodeSystem.class, ctx, sdPath, fromClasspath);
                    ppSupport.addCodeSystem(codeSystem);

                } else if (FhirDefType.VALUESET.equals(item.getType())) {
                    ValueSet valueSet = loadResourceFromClasspath(ValueSet.class, ctx, sdPath, fromClasspath);
                    ppSupport.addValueSet(valueSet);

                } else {
                    StructureDefinition differential =
                            loadResourceFromClasspath(StructureDefinition.class, ctx, sdPath, fromClasspath);
                    ppSupport.addStructureDefinition(differential);
                }
            }
        }

        // Create a chain that will hold our modules
        ValidationSupportChain supportChain = new ValidationSupportChain();

        // add modules
        supportChain.addValidationSupport(new InMemoryTerminologyServerValidationSupport(ctx));
        supportChain.addValidationSupport(ppSupport);
        supportChain.addValidationSupport(defaultSupport);
        supportChain.addValidationSupport(new SnapshotGeneratingValidationSupport(ctx));
        
        // Wrap the chain in a cache to improve performance
        CachingValidationSupport cache = new CachingValidationSupport(supportChain);

        // Create a validator using the FhirInstanceValidator module. We can use this
        // validator to perform validation
        FhirInstanceValidator validatorModule = new FhirInstanceValidator(cache);
        
        // module configurations
        validatorModule.setBestPracticeWarningLevel(BestPracticeWarningLevel.Ignore);
        validatorModule.setErrorForUnknownProfiles(true);
        validatorModule.setAnyExtensionsAllowed(false);
        
        LOG.info("profiles location: {}", location);
        
        return validatorModule;
	}

    /**
     * Carrega as definições de validação para o <code>HAPI-FHIR</code>.
     * 
     * @param ctx
     * @param props
     * 
     * @return
     * 
     * @throws Exception
     */
    @Bean
    public FhirValidator getFhirValidator(final FhirContext ctx) throws Exception {
        return ctx.newValidator().registerValidatorModule(getFhirInstanceValidator(ctx));
    }
    
    /**
     * Carrega os arquivos dos profiles.
     * 
     * @param <T>
     * @param type
     * @param ctx
     * @param resourceName
     * @param fromClassLoader
     * 
     * @return
     * 
     * @throws IOException
     */
    protected <T extends IBaseResource> T loadResourceFromClasspath(
            final Class<T> type,
            final FhirContext ctx,
            final String resourceName,
            final boolean fromClassLoader)
            throws IOException {

        final InputStream stream;
        
        if (fromClassLoader) {
            stream = FhirBeansConfiguration.class.getResourceAsStream(resourceName);
        } else {
            stream = new FileInputStream(Paths.get(resourceName).toFile());
        }
        
        if (stream == null) {
            throw new IllegalAccessError("Unable to load resource: " + resourceName);
        }

        final String string = IOUtils.toString(stream, StandardCharsets.UTF_8);
        final IParser newJsonParser = EncodingEnum.detectEncodingNoDefault(string).newParser(ctx);
        return newJsonParser.parseResource(type, string);
    }
    
    /**
     * Carrega os arquivos XML numa estrutura
     * 
     * @param _path
     * @param svlCtx
     * @param fromClassLoader
     * 
     * @return
     * 
     * @throws IOException
     * @throws ParserConfigurationException
     * @throws SAXException
     */
    public List<List<FhirDef>> load(
            final String _path,
            final ServletContext svlCtx,
            final boolean fromClassLoader)
            throws IOException, ParserConfigurationException, SAXException {

        LOG.debug("_path: {} | svlCtx: {} | fromClassLoader: {}", _path, svlCtx, fromClassLoader);
        
        final URL onWar;
        
        if (svlCtx == null) {
            onWar = null;
        } else {
            onWar = svlCtx.getResource(ON_WAR_BASE_PATH);
        }

        final List<String> files = new ArrayList<>();
        
        if (onWar == null) {
            files.addAll(FileUtil.listFolder(_path));
        } else {
            final String path = String.format(
                    "%s/%s",
                    ON_WAR_BASE_PATH,
                    _path.replace(SRC_BASE_PATH, StringUtils.EMPTY));

            FileUtil.listFilesFromWar(svlCtx, path, files);
        }
        
        final List<List<FhirDef>> loadOrder = new ArrayList<>();

        final List<FhirDef> lCodeSystem = new ArrayList<>();
        final List<FhirDef> lValueSet = new ArrayList<>();
        final List<FhirDef> lExtension = new ArrayList<>();
        final List<FhirDef> lDataType = new ArrayList<>();
        final List<FhirDef> lStructures = new ArrayList<>();

        // carregando os XMLs para fazer a separação
        InputStream is;
        Document doc;
        FhirDef def;

        NodeList nls;
        String attValue;
        String _item;

        for (String item : files) {
            if (StringUtils.endsWithIgnoreCase(item, ".xml")) {
                _item = item
                        .replace(SRC_BASE_PATH, StringUtils.EMPTY)
                        .replace(ON_WAR_BASE_PATH, StringUtils.EMPTY);
                
                if (fromClassLoader) {
                    is = this.getClass().getResourceAsStream(_item);
                } else {
                    is = new FileInputStream(Paths.get(_item).toFile());
                }

                doc = XmlUtilities.readXml(is);
                def = FhirDef.newInstance();

                def.setFilePath(_item);

                nls = xPath(doc, "//name");
                def.setName(value(nls));

                nls = xPath(doc, "//url");
                def.setUrl(value(nls));

                nls = xPath(doc, "//baseDefinition");
                def.setBaseDefinition(value(nls));

                nls = xPath(doc, "//version");
                def.setVersion(value(nls));

                nls = xPath(doc, "/CodeSystem");

                if (nls != null) {
                    def.setType(FhirDefType.CODE_SYSTEM);
                    def.setBaseDefinition("CodeSystem");
                    lCodeSystem.add(def);

                } else {

                    nls = xPath(doc, "/ValueSet");
                    if (nls != null) {
                        def.setType(FhirDefType.VALUESET);
                        def.setBaseDefinition("ValueSet");
                        lValueSet.add(def);

                    } else {

                        // extension e data type
                        nls = xPath(doc, "/StructureDefinition/type");
                        if (nls != null) {
                            attValue = value(nls);
                            if (StringUtils.equalsIgnoreCase("Extension", attValue)) {
                                def.setType(FhirDefType.EXTENSION);
                                lExtension.add(def);

                            } else {

                                nls = xPath(doc, "/StructureDefinition/kind");
                                if (nls != null) {
                                    attValue = value(nls);
                                    if (StringUtils.equals("complex-type", attValue)) {
                                        def.setType(FhirDefType.DATA_TYPE);
                                        lDataType.add(def);

                                    } else if (StringUtils.equals("resource", attValue)) {
                                        // structures
                                        attValue = value(nls);
                                        if (StringUtils.equals("resource", attValue)) {
                                            def.setType(FhirDefType.STRUCTURE);
                                            lStructures.add(def);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (is != null) {
                    is.close();
                }
            }
        }

        doc = null;

        Collections.sort(lCodeSystem);
        loadOrder.add(lCodeSystem);

        Collections.sort(lValueSet);
        loadOrder.add(lValueSet);

        orderDeps(lExtension, loadOrder);
        orderDeps(lDataType, loadOrder);
        orderDeps(lStructures, loadOrder);

        return loadOrder;
    }
    
    /**
     * Ordena os recursos para carregamento de acordo 
     * com a ordem de dependência entre os profiles.
     * 
     * @param lsdfhir
     * @param loadOrder
     */
    private void orderDeps(
            final List<FhirDef> lsdfhir,
            final List<List<FhirDef>> loadOrder) {

        List<FhirDef> lst;

        final Map<String, List<FhirDef>> depsmap = new LinkedHashMap<>();

        depsmap.put(FHIR_BASE_DEF, new ArrayList<>());

        for (FhirDef item : lsdfhir) {
            if (!StringUtils.startsWith(item.getBaseDefinition(), FHIR_BASE_DEF)) {
                depsmap.put(item.getBaseDefinition(), new ArrayList<>());
            }
        }

        for (FhirDef item : lsdfhir) {
            if (StringUtils.startsWith(item.getBaseDefinition(), FHIR_BASE_DEF)) {
                depsmap.get(FHIR_BASE_DEF).add(item);
            } else if (depsmap.get(item.getBaseDefinition()) != null) {
                depsmap.get(item.getBaseDefinition()).add(item);
            }
        }

        for (Map.Entry<String, List<FhirDef>> entry : depsmap.entrySet()) {
            lst = entry.getValue();
            Collections.sort(lst);
            loadOrder.add(lst);
        }
    }
    
    /**
     * "Valor" do atributo <code>value</code> do 
     * primeiro item de um {@link NodeList}.
     * 
     * @param nls
     * 
     * @return
     */
    private String value(final NodeList nls) {
        if (nls == null || nls.getLength() <= 0) {
            return null;
        } else {
            return attValue((Node) nls.item(0), "value");
        }
    }
    
    /**
     * "Valor" de um atributo de um {@link Node}.
     * 
     * @param nd
     * @param name
     * 
     * @return
     */
    private String attValue(final Node nd, final String name) {
        String value;

        value = null;

        if (nd != null) {
            final NamedNodeMap nnm = nd.getAttributes();

            if (nnm != null) {
                for (int i = 0; i < nnm.getLength(); i++) {
                    Node att = (Node) nnm.item(i);

                    if (StringUtils.equals(att.getNodeName(), name)) {
                        value = att.getNodeValue();
                    }
                }
            }
        }

        return value;
    }
    
    /**
     * Recupera "nós" de um arquivo XML utilizando
     * <i>XPath</i>.
     * 
     * @param doc
     * @param xPath
     * 
     * @return
     */
    private NodeList xPath(final Document doc, final String xPath) {
        NodeList nls;

        nls = XmlUtilities.getXmlNodesWithXPath(doc, xPath);

        if (nls == null || nls.getLength() <= 0) {
            nls = null;
        }

        return nls;
    }
}
