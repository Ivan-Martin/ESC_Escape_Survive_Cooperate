package esc.game;

import java.util.HashSet;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Handler2 extends TextWebSocketHandler {

	private ObjectMapper mapper = new ObjectMapper();
	private Map <Integer, WebSocketSession> sesiones = new ConcurrentHashMap <> ();
	private Map <Integer, Integer> emparejamientos = new ConcurrentHashMap <> ();
	
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
			
		} else {
			JsonNode responder = mapper.readTree(message.getPayload());
			
			System.out.println("Message sent: " + message.toString());
			
			WebSocketSession s = sesiones.get(emparejamientos.get(userid));
			
			s.sendMessage(new TextMessage(responder.toString()));
			
		}
	}
}
