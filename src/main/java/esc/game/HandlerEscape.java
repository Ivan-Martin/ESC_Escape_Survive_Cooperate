package esc.game;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class HandlerEscape extends TextWebSocketHandler {

	private static ObjectMapper mapper = new ObjectMapper();
	private static Map <Integer, WebSocketSession> sesiones = new ConcurrentHashMap <> ();
	//En el mapa "sesiones" almacenamos como clave el identificador del usuario y como valor su sesión de websockets
	private static Map <Integer, Integer> emparejamientos = new ConcurrentHashMap <> ();
	private static Map <Integer, Integer> tiempos = new ConcurrentHashMap <> ();
	
	private static ScheduledExecutorService timer = Executors.newSingleThreadScheduledExecutor();
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println("Message received: " + message.getPayload());
		
		JsonNode node = mapper.readTree(message.getPayload());
		String id = node.get("id").asText();
		int userid = node.get("userid").asInt();
		
		if(id.equals("conectarServidor")) {
			int rivalid = node.get("rivalid").asInt();
			if(!sesiones.containsKey(userid)) {
				sesiones.put(userid, session);
				emparejamientos.put(userid, rivalid);
			}
			if(sesiones.containsKey(rivalid)) {
				ObjectNode respuesta = mapper.createObjectNode();
				respuesta.put("comenzar", true);
				respuesta.put("userid", 0);
				WebSocketSession s = sesiones.get(emparejamientos.get(userid));
				System.out.println("Message sent: " + respuesta.toString());
				s.sendMessage(new TextMessage(respuesta.toString()));
				s = sesiones.get(emparejamientos.get(rivalid));
				System.out.println("Message sent: " + respuesta.toString());
				s.sendMessage(new TextMessage(respuesta.toString()));
			}
			
		} else if (id.equals("desconexion")) {
			ObjectNode respuesta = mapper.createObjectNode();
			respuesta.put("userid", 0);
			respuesta.put("id", "desconexion");
			WebSocketSession s = sesiones.get(emparejamientos.get(userid));
			s.sendMessage(new TextMessage(respuesta.toString()));
			limpiar(emparejamientos.get(userid));
			limpiar(userid);
			
		} else if(id.equals("velocidad")){
			tiempos.put(userid, 10);
		} else {
			
			JsonNode responder = mapper.readTree(message.getPayload());
			
			System.out.println("Message sent: " + message.toString());
			
			WebSocketSession s = sesiones.get(emparejamientos.get(userid));
			
			s.sendMessage(new TextMessage(responder.toString()));
			
		}
	}
	
	private void limpiar(int userid) {
		tiempos.remove(userid);
		emparejamientos.remove(userid);
		sesiones.remove(userid);
		
	}

	public static void inicializarTemporizador () {
		timer.scheduleWithFixedDelay(() -> {
			for (Integer i : tiempos.keySet()) {
				tiempos.put(i, tiempos.get(i)-1);
			}
			for (Integer i : tiempos.keySet()) {
				if(tiempos.get(i) <= 0) {
					try {
						desconectar(i);
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
		}, 1000, 1000, TimeUnit.MILLISECONDS);
	}
	
	private static void desconectar (int i) throws IOException {
		ObjectNode respuesta = mapper.createObjectNode();
		respuesta.put("userid", 0);
		respuesta.put("id", "desconexion");
		WebSocketSession s = sesiones.get(emparejamientos.get(i));
		s.sendMessage(new TextMessage(respuesta.toString()));
		tiempos.remove(i);
		emparejamientos.remove(emparejamientos.get(i));
		sesiones.remove(emparejamientos.get(i));
		tiempos.remove(emparejamientos.get(i));
		emparejamientos.remove(i);
		sesiones.remove(i);
	}
}
