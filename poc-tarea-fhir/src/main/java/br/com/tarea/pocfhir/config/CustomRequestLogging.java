package br.com.tarea.pocfhir.config;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.AbstractRequestLoggingFilter;

/**
 * Realiza o log do request.<br/>
 * <br/>
 * Para que o log seja feito é preciso ativar o nível de DEBUG para esta classe.<br/>
 * <br/>
 * <b>IMPORTANTE</b>: Não é realizado o log do response <b>APENAS do request</b>.
 * 
 * @author herberson
 *
 */
public class CustomRequestLogging extends AbstractRequestLoggingFilter {
	protected static final Logger LOGGER = LoggerFactory.getLogger(CustomRequestLogging.class);
	
	/**
	 * Cria uma instância padrão do objeto.
	 * 
	 * @return
	 */
	public static CustomRequestLogging _default() {
		final CustomRequestLogging instance = new CustomRequestLogging();
		instance.setIncludeClientInfo(true);
		instance.setIncludeQueryString(true);
		instance.setIncludePayload(true);
		instance.setIncludeHeaders(true);
		instance.setMaxPayloadLength(10_000);
		return instance;
	}
	
	@Override
	protected boolean shouldLog(HttpServletRequest request) {
		return LOGGER.isDebugEnabled();
	}

	@Override
	protected void beforeRequest(HttpServletRequest request, String message) {
		LOGGER.debug(message);
	}

	@Override
	protected void afterRequest(HttpServletRequest request, String message) {
		LOGGER.debug(message);
	}
}
