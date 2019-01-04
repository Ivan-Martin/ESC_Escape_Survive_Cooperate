package esc.game;

import java.util.HashSet;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Handler2 extends TextWebSocketHandler {

	private ObjectMapper mapper = new ObjectMapper();
	private HashSet <WebSocketSession> jugadores = new HashSet <> ();
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println("Message received: " + message.getPayload());
		
		JsonNode node = mapper.readTree(message.getPayload());
		String id = node.get("id").asText();
		System.out.println(id);
		
		if(id.equals("conectarServidor")) {
			if(!jugadores.contains(session)) {
				jugadores.add(session);
			}
		} else {
			JsonNode responder = mapper.readTree(message.getPayload());
			
			System.out.println("Message sent: " + message.toString());
			
			for (WebSocketSession s : jugadores) {
				s.sendMessage(new TextMessage(responder.toString()));
			}
		}
	}
}
