package br.com.tarea.pocfhir.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.TransformerFactoryConfigurationError;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * Classe utilitária para conversões.
 * 
 * @author herberson
 *
 */
public class XmlUtilities {
	
	/**
	 * Converte um w3c Node para String. Este método não identa o XML.
	 * 
	 * @param xmlNode Nó do documento XML.
	 * @return String com a representação do XML.
	 * @throws TransformerException 
	 * @throws UtilsException
	 */
	public static String xmlNodeToString(final Node xmlNode) {
		return xmlNodeToString(xmlNode, false);
	}
	
	/**
	 * Converte um w3c Node para String. Este método tem a opção de identar o XML.
	 * 
	 * @param xmlNode Nó do documento XML.
	 * @param pretty <code>true</code> para identar o xml.
	 * @return String com a representação do XML.
	 * @throws TransformerException 
	 */
	public static String xmlNodeToString(final Node xmlNode, final boolean pretty) {
	    Transformer transformer;
	    StringWriter writer;
	    String rtn;
	    
		try {
			transformer = TransformerFactory.newInstance().newTransformer();
			if (pretty) {
				transformer.setOutputProperty(OutputKeys.INDENT, "yes");
				transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
			}
			writer = new StringWriter();
			transformer.transform(new DOMSource(xmlNode), new StreamResult(writer));
			rtn = writer.toString();
		} catch (TransformerConfigurationException e) {
			rtn = null;
		} catch (TransformerFactoryConfigurationError e) {
			rtn = null;
		} catch (TransformerException e) {
			rtn = null;
		} finally {
			
			transformer = null;
			writer = null;
		}
	    
	    return rtn;
	}	


	/**
	 * Utiliza XPATH para remover "empty namespaces".
	 * 
	 * @param xmlAsString
	 * @return
	 */
	public static String removeEmptyNamespace(final String xmlAsString) {
	    String result;
	    TransformerFactory factory;
	    Source xslt;
	    Transformer transformer;
	    Source text;
	    
	    StringReader xmlsr;
	    StringWriter resultsw;
	    StringReader xsltsr;
	    
	    try {
	        resultsw = new StringWriter();
	        xsltsr = new StringReader(
	    		"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + 
	    		"<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">\n" + 
	    		"\n" + 
	    		"    <xsl:template priority=\"2\" match=\"*\">\n" + 
	    		"        <xsl:choose>\n" + 
	    		"            <xsl:when test=\"namespace-uri()=''\">\n" + 
	    		"                <xsl:element name=\"{local-name()}\" namespace=\"{namespace-uri(ancestor::*[namespace-uri()!=''][1])}\">\n" + 
	    		"                    <xsl:apply-templates select=\"@* | node()\"/>\n" + 
	    		"                </xsl:element>\n" + 
	    		"            </xsl:when>\n" + 
	    		"            <xsl:otherwise>\n" + 
	    		"                <xsl:element name=\"{local-name()}\" namespace=\"{namespace-uri()}\">\n" + 
	    		"                    <xsl:apply-templates select=\"@* | node()\"/>\n" + 
	    		"                </xsl:element>\n" + 
	    		"            </xsl:otherwise>\n" + 
	    		"        </xsl:choose>\n" + 
	    		"    </xsl:template>\n" + 
	    		"\n" + 
	    		"    <xsl:template priority=\"1\" match=\"@* | node()\">\n" + 
	    		"        <xsl:copy-of select=\".\"/>\n" + 
	    		"    </xsl:template>\n" + 
	    		"\n" + 
	    		"</xsl:stylesheet>"
	        );
	        xmlsr = new StringReader(xmlAsString);
	        factory = TransformerFactory.newInstance();
	        
	        xslt = new StreamSource(xsltsr);
	        
	        transformer = factory.newTransformer(xslt);
	
	        text = new StreamSource(xmlsr);
	        transformer.transform(text, new StreamResult(resultsw));
	        
	        result = resultsw.toString();
	        
	        xmlsr.close();
	        resultsw.close();
	        xsltsr.close();
	    } catch (Exception e) {
	        result = null;
	    } finally {
	        factory = null;
	        xslt = null;
	        transformer = null;
	        text = null;
	        xmlsr = null;
	        resultsw = null;
	        xsltsr = null;
	    } //end try ... catch ... finally
	    
	    return result;
	} //end method
	
	/**
	 * Lê um arquivo XML.
	 * 
	 * @param path
	 * @param file
	 * @return
	 * @throws Exception
	 */
	public static Document readXml(final String path, final String file) throws Exception {
		return readXml(new FileInputStream(path + System.getProperty("file.separator") + file));
	}
	
	/**
	 * Lê um InpuStream para um XML Document.
	 * @param path
	 * @return
	 * @throws ParserConfigurationException 
	 * @throws IOException 
	 * @throws SAXException 
	 */
	public static Document readXml(final InputStream path) throws ParserConfigurationException, SAXException, IOException {
		DocumentBuilderFactory dbFactory;
		DocumentBuilder dBuilder;
		Document doc;
		
		dbFactory = DocumentBuilderFactory.newInstance();
		dBuilder = dbFactory.newDocumentBuilder();
		doc = dBuilder.parse(path);
		
		return doc;
	}
	
	/**
	 * Cria um XML Document a partir de uma String.
	 * 
	 * @param xmlString
	 * @return
	 */
	public static Document stringToXmlDoc(String xmlString) {
		DocumentBuilderFactory factory;
		DocumentBuilder builder;
		Document doc;
		
		factory = DocumentBuilderFactory.newInstance();
		builder = null;
		
		try {
			builder = factory.newDocumentBuilder();
			doc = builder.parse(new InputSource(new StringReader(xmlString)));
		} catch (Exception e) {
			doc = null;
		}
		return doc;
	}
	
	public static NodeList getXmlNodesWithXPath(final Document document, final String xPathExpression) {
		return getXmlNodesWithXPath(document, xPathExpression, true);
	}
	
    public static NodeList getXmlNodesWithXPath(final Document document, final String xPathExpression, final boolean global) {
        XPathFactory xpf;
        XPath xpath;
        XPathExpression expression;
        NodeList nset;
        String xpathParsed;
        String[] xpathParts;
        
        try {
            xpf = XPathFactory.newInstance();
            xpath = xpf.newXPath();
            
            if (global) {
                xpathParts = xPathExpression.split("/");
                xpathParsed = "";

                for (String part : xpathParts) {
                    if (part != null && !part.trim().isEmpty()) {
                        xpathParsed += String.format("/*[local-name() = '%s']", part);
                    } else if (part != null && !xpathParsed.trim().isEmpty()) {
                        xpathParsed += "/" + part;
                    }
                }

                if (xPathExpression.startsWith("//")) {
                    xpathParsed = "/" + xpathParsed;
                }
    		} else {
    			xpathParsed = xPathExpression;
    		}

            expression = xpath.compile(xpathParsed);
            nset = (NodeList) expression.evaluate(document, XPathConstants.NODESET);
        } catch (Exception e) {
        	nset = null;
        }

        return nset;
    }
    
    public static String getXmlTextContentWithXPath(final Document document, final String xPathExpression) {
    	return getXmlTextContentWithXPath(document, xPathExpression, true);
    }
    
    public static String getXmlTextContentWithXPath(final Document document, final String xPathExpression, final boolean global) {
    	XPathFactory xpf;
    	XPath xpath;
    	XPathExpression expression;
    	Node node;
    	String xpathParsed;
    	String[] xpathParts;
    	String value;
    	
    	try {
    		xpf = XPathFactory.newInstance();
    		xpath = xpf.newXPath();
    		
    		if (global) {
    			xpathParts = xPathExpression.split("/");
    			xpathParsed = "";
    			
    			for (String part : xpathParts) {
    				if (part != null && !part.trim().isEmpty()) {
    					xpathParsed += String.format("/*[local-name() = '%s']", part);
    				} else if (part != null && !xpathParsed.trim().isEmpty()) {
    					xpathParsed += "/" + part;
    				}
    			}
    			
    			if (xPathExpression.startsWith("//")) {
    				xpathParsed = "/" + xpathParsed;
    			}
    		} else {
    			xpathParsed = xPathExpression;
    		}
    		
    		expression = xpath.compile(xpathParsed);
    		if (xpathParsed.toLowerCase().startsWith("count(")) {
    			value = String.valueOf(expression.evaluate(document, XPathConstants.NUMBER));
    		} else if (xpathParsed.toLowerCase().endsWith("/text()")) {
    			value = (String)expression.evaluate(document, XPathConstants.STRING);
    		} else {
    			node = (Node)expression.evaluate(document, XPathConstants.NODE);
    			if (node == null) {
    				value = null;
    			} else {
    				value = node.getTextContent();
    			}
    		}
    	} catch (Exception e) {
    		value = null;
    	}
    	
    	return value;
    }
    
    
	/**
	 * Utiliza XPATH para remover "empty namespaces".
	 * 
	 * @param xmlAsString
	 * @return
	 */
	public static List<String> generateXPathForXml(final String xmlAsString) {
	    String result;
	    TransformerFactory factory;
	    Source xslt;
	    Transformer transformer;
	    Source text;
	    String[] rtn;
	    List<String> lst;
	    
	    StringReader xmlsr;
	    StringWriter resultsw;
	    StringReader xsltsr;
	    lst = new ArrayList<>();
	    
	    try {
	        resultsw = new StringWriter();
	        xsltsr = new StringReader(
	    		"<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">\n" + 
	    		"    <xsl:output method=\"text\"/>\n" + 
	    		"    <xsl:strip-space elements=\"*\"/>\n" + 
	    		"    <xsl:template match=\"text()\"/>\n" + 
	    		"    <xsl:template match=\"*\">\n" + 
	    		"        <xsl:variable name=\"id\" select=\"generate-id()\"/>\n" + 
	    		"        <xsl:for-each select=\"ancestor-or-self::*\">\n" + 
	    		"            <xsl:value-of select=\"concat('/',local-name())\"/>\n" + 
	    		"            <!--Predicate is only output when needed.-->\n" + 
	    		"            <xsl:if test=\"(preceding-sibling::*|following-sibling::*)[local-name()=local-name(current())]\">\n" + 
	    		"                <xsl:value-of select=\"concat('[',count(preceding-sibling::*[local-name()=local-name(current())])+1,']')\"/>\n" + 
	    		"            </xsl:if>\n" + 
	    		"            <!--Output attributes.-->\n" + 
	    		"            <xsl:if test=\"@* and generate-id() = $id\">\n" + 
	    		"                <xsl:text>[</xsl:text>\n" + 
	    		"                <xsl:apply-templates select=\"@*\"/>\n" + 
	    		"                <xsl:text>]</xsl:text>\n" + 
	    		"            </xsl:if>\n" + 
	    		"        </xsl:for-each>\n" + 
	    		"        <xsl:text>&#xA;</xsl:text>\n" + 
	    		"        <xsl:apply-templates select=\"node()\"/>\n" + 
	    		"    </xsl:template>\n" + 
	    		"    <xsl:template match=\"@*\">\n" + 
	    		"        <xsl:if test=\"position() != 1\">\n" + 
	    		"            <xsl:text>][</xsl:text>\n" + 
	    		"        </xsl:if>\n" + 
	    		"        <xsl:value-of select=\"concat('@',local-name(),'=&quot;',.,'&quot;')\"/>\n" + 
	    		"    </xsl:template>\n" + 
	    		"</xsl:stylesheet>"
	        );
	        xmlsr = new StringReader(xmlAsString);
	        factory = TransformerFactory.newInstance();
	        
	        xslt = new StreamSource(xsltsr);
	        
	        transformer = factory.newTransformer(xslt);
	
	        text = new StreamSource(xmlsr);
	        transformer.transform(text, new StreamResult(resultsw));
	        
	        result = resultsw.toString();
	        
	        xmlsr.close();
	        resultsw.close();
	        xsltsr.close();
	    } catch (Exception e) {
	        result = null;
	    } finally {
	        factory = null;
	        xslt = null;
	        transformer = null;
	        text = null;
	        xmlsr = null;
	        resultsw = null;
	        xsltsr = null;
	    } //end try ... catch ... finally
	    
	    if (result != null && !result.trim().isEmpty()) {
	    	rtn = result.split("\\r?\\n");
	    } else {
		    rtn = new String[]{};
	    }
	    
	    lst.addAll(Arrays.asList(rtn));
	    Collections.sort(lst);
	    
	    return lst;
	} //end method
	
	public static void main(String[] args) throws Exception {
		Document xml;
		NodeList nls;
		
		xml = readXml(new FileInputStream("/projetos/datasus-ehr-git/ehr-services/src/main/resources/fhir/extension/BRAdministradorTerceiro.StructureDefinition.xml"));
		xml = readXml(new FileInputStream("/projetos/datasus-ehr-git/ehr-services/src/main/resources/fhir/datatype/BRDocumentoIndividuo.StructureDefinition.xml"));
		xml = readXml(new FileInputStream("/projetos/datasus-ehr-git/ehr-services/src/main/resources/fhir/codesystem/BRCaraterAtendimento.CodeSystem.xml"));
		xml = readXml(new FileInputStream("/projetos/datasus-ehr-git/ehr-services/src/main/resources/fhir/valueset/BRCaraterAtendimento.ValueSet.xml"));
		xml = readXml(new FileInputStream("/projetos/datasus-ehr-git/ehr-services/src/main/resources/fhir/structure/BRAmostraBiologica.StructureDefinition.xml"));
		
		boolean printxpath = false;
		
		if (printxpath) {
			generateXPathForXml(xmlNodeToString(xml)).forEach(item -> {
				System.out.println(item);
			});
		}
		
		String[] xp = new String[] {
				"/CodeSystem",
				"/ValueSet",
				"/StructureDefinition/type", 
				"/StructureDefinition/kind", 
				"/StructureDefinition/baseDefinition",
				"//url",
				"//name"
				};
		
		for (String xpi : xp) {
			nls = getXmlNodesWithXPath(xml, xpi);
			
			System.out.println("---->> " + xpi + " :: " + nls.getLength());
			
			if (nls.getLength() > 0) {
				NamedNodeMap nnm = ((Node) nls.item(0)).getAttributes();
				
				if (nnm != null) {
					for (int i = 0 ; i < nnm.getLength(); i++) {
						Node att = (Node) nnm.item(i);
						System.out.println(att.getNodeName() + ": " + att.getNodeValue());
					}
				}
			}			
		}
	}
	
}
