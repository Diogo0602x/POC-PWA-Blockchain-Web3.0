package br.com.tarea.pocfhir.service;

import java.net.NetworkInterface;
import java.security.SecureRandom;
import java.util.Enumeration;

/**
 * Distributed Sequence Generator. Inspired by Twitter snowflake:
 * https://github.com/twitter/snowflake/tree/snowflake-2010
 *
 * This class should be used as a Singleton. Make sure that you create and reuse
 * a Single instance of SequenceGenerator per node in your distributed system
 * cluster.
 */
public class SequenceGenerator {
	private static final int EPOCH_BITS = 41;
	private static final int NODE_ID_BITS = 10;
	private static final int SEQUENCE_BITS = 12;

	private static final int maxNodeId = (int) (Math.pow(2, NODE_ID_BITS) - 1);
	private static final int maxSequence = (int) (Math.pow(2, SEQUENCE_BITS) - 1);

	/**
	 * Custom Epoch (2019-12-31T00:00:00 UTC)
	 */
	private static final long CUSTOM_EPOCH = 1577761200000L;

	private final int nodeId;
	private final long customEpoch;

	private volatile long lastTimestamp = -1L;
	private volatile long sequence = 0L;

	/**
	 * Cria um sequence generator com um determinado nodeId.
	 * 
	 * O "customEpoch" é inicializado com a constante "CUSTOM_EPOCH".
	 * 
	 * @param nodeId
	 */
	public SequenceGenerator(final int nodeId) {
		if (nodeId < 0 || nodeId > maxNodeId) {
			throw new IllegalArgumentException(String.format("NodeId must be between %d and %d", 0, maxNodeId));
		}
		this.nodeId = nodeId;
		this.customEpoch = CUSTOM_EPOCH;
	}
	
	/**
	 * Cria uma instância calculando o nodeId a partir
	 * do argumento.
	 * 
	 * @param nodeName
	 */
	public SequenceGenerator(final String nodeName) {
		if (nodeName == null || nodeName.replaceAll("\\s", "").isEmpty()) {
			throw new IllegalArgumentException("nodeName cannot be null or empty");
		}
		this.nodeId = nodeName.hashCode() & maxNodeId;
		this.customEpoch = CUSTOM_EPOCH;
	}

	/**
	 * Cria uma instância a partir de um determinado momento.
	 * O nodeId é calculado pelo método "createNodeId()".
	 * 
	 * @param customEpoch
	 */
	public SequenceGenerator(final long customEpoch) {
		this.nodeId = createNodeId();
		this.customEpoch = customEpoch;
	}
	
	/**
	 * Cria uma instância onde nodeId e customEpoch são informados
	 * manualmente.
	 * 
	 * @param nodeId
	 * @param customEpoch
	 */
	public SequenceGenerator(final int nodeId, final long customEpoch) {
		if (nodeId < 0 || nodeId > maxNodeId) {
			throw new IllegalArgumentException(String.format("NodeId must be between %d and %d", 0, maxNodeId));
		}
		this.nodeId = nodeId;
		this.customEpoch = customEpoch;
	}
	
	/**
	 * Construtor padrão.
	 * O nodeId é calculado o customEpoch assume o valor da
	 * constante "CUSTOM_EPOCH".
	 */
	public SequenceGenerator() {
		this.nodeId = createNodeId();
		this.customEpoch = CUSTOM_EPOCH;
	}
	
	/**
	 * Gera o próximo número.
	 * 
	 * @return
	 */
	public synchronized long nextId() {
		long currentTimestamp = _timestamp();

		if (currentTimestamp < lastTimestamp) {
			throw new IllegalStateException("Invalid System Clock!");
		}

		if (currentTimestamp == lastTimestamp) {
			sequence = (sequence + 1) & maxSequence;
			if (sequence == 0) {
				// Sequence Exhausted, wait till next millisecond.
				currentTimestamp = waitNextMillis(currentTimestamp);
			}
		} else {
			// reset sequence to start with zero for the next millisecond
			sequence = 0;
		}

		lastTimestamp = currentTimestamp;

		long id;

        id = currentTimestamp << (NODE_ID_BITS + SEQUENCE_BITS);
        id |= (nodeId << SEQUENCE_BITS);
        id |= sequence;

		return id;
	}

	/**
	 * Recupera o timestamp atual ajustado para o "custom epoch".
	 * 
	 * @return
	 */
	private long _timestamp() {
		return System.currentTimeMillis() - customEpoch;
	}

	/**
	 * Em caso de colisão de momentos, espera o próximo milissegundo.
	 * 
	 * @param currentTimestamp
	 * @return
	 */
	private long waitNextMillis(final long currentTimestamp) {
		long _cts = currentTimestamp;
		while (_cts == lastTimestamp) {
			_cts = _timestamp();
		}
		return _cts;
	}
	
	/**
	 * Cria um nodeId a partir do endereço MAC das interfaces de
	 * rede da máquina onde a aplicação está sendo executada.
	 * 
	 * No caso de servicores Weblogic o nome do servidor (propriedade
	 * "weblogic.Name") é incorporado para criação do nodeId.
	 * 
	 * @return
	 */
	private int createNodeId() {
		int nodeId;

		try {
			final StringBuilder sb = new StringBuilder();
			final Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();

			while (networkInterfaces.hasMoreElements()) {
				final NetworkInterface networkInterface;
				final byte[] mac;

				networkInterface = networkInterfaces.nextElement();
				mac = networkInterface.getHardwareAddress();

				if (mac != null) {
					for (int i = 0; i < mac.length; i++) {
						sb.append(String.format("%02X", mac[i]));
					}
				}
			}
			
			sb.append(System.getProperty("weblogic.Name", ""));
			
			nodeId = sb.toString().hashCode();
		} catch (Exception ex) {
			nodeId = (new SecureRandom().nextInt());
		}

		nodeId = nodeId & maxNodeId;

		return nodeId;
	}
	
	/**
	 * Realiza o parser do ID retornando sua composição.
	 * 
	 * @param id
	 * @return
	 */
	public long[] parse(final long id) {
		final long maskNodeId = ((1L << NODE_ID_BITS) - 1) << SEQUENCE_BITS;
		final long maskSequence = (1L << SEQUENCE_BITS) - 1;

		final long timestamp = (id >> (NODE_ID_BITS + SEQUENCE_BITS)) + customEpoch;
		final long nodeId = (id & maskNodeId) >> SEQUENCE_BITS;
		final long sequence = id & maskSequence;

		return new long[] { timestamp, nodeId, sequence };
	}
	
	/**
	 * Recupera o número sequencial que compõe o número.
	 * 
	 * @param id
	 * @return
	 */
	public long sequence(final long id) {
		return parse(id)[2];
	}
	
	/**
	 * Recupera o "node id" que compõem o número.
	 * 
	 * @param id
	 * @return
	 */
	public long nodeId(final long id) {
		return parse(id)[1];
	}
	
	/**
	 * Recupera o "momento" de geração que compõem o número.
	 * 
	 * @param id
	 * @return
	 */
	public long timestamp(final long id) {
		return parse(id)[0];
	}
	
	/**
	 * Retorna as partes que compõem o id em uma string.
	 * 
	 * @param id
	 * @return
	 */
	public String asString(final long id) {
		final long[] parts  = parse(id);
		return String.format("timestamp: %d | nodeId: %d | sequence: %d", parts[0], parts[1], parts[2]);
	}
	
	/**
	 * Retorna as configurações do gerador.
	 */
	@Override
	public String toString() {
		return String.format("[EPOCH_BITS=%s, NODE_ID_BITS=%s, SEQUENCE_BITS=%s, CUSTOM_EPOCH=%s, NodeId=%s]",
				EPOCH_BITS, NODE_ID_BITS, SEQUENCE_BITS, customEpoch, nodeId);
	}
}
