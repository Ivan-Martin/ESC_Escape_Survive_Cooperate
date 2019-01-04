package esc.game;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UsersController {

	Map<Long, User> connectedusers = new ConcurrentHashMap<>(); 
	AtomicLong nextId;
	Map<String, User> allusers = new ConcurrentHashMap<> ();
	
	public UsersController () throws IOException {
		BufferedReader input = new BufferedReader (new FileReader (new File ("src/main/java/data.txt")));
		String linea;
		long id = 0;
		while((linea = input.readLine()) != null) {
			id++;
			String [] spliteado = linea.split(" ");
			long identificador = Long.parseLong(spliteado[0]);
			String nombre = spliteado[1];
			int [] partidas = new int [5];
			for(int i = 2; i < 7; i++) {
				partidas[i-2] = Integer.parseInt(spliteado[i]);
			}
			User usuario = new User();
			usuario.setId(identificador);
			usuario.setName(nombre);
			usuario.setPartidasjugadas(partidas);
			allusers.put(nombre, usuario);
		}
		nextId = new AtomicLong(id);
		input.close();
	}
	
	@GetMapping
	public Collection<User> connectedusers() {
		return connectedusers.values();
	}

	@PostMapping
	public ResponseEntity<User> nuevoUser(@RequestBody User usuario) {
		if(usuario.getName() != null) {
			long id;
			if(allusers.containsKey(usuario.getName())) {
				User usernuevo = allusers.get(usuario.getName());
				id = usernuevo.getId();
				usuario.setId(id);
				usuario.setPartidasjugadas(usernuevo.getPartidasjugadas());
				connectedusers.put(id, usuario);
			} else {
				id = nextId.incrementAndGet();
				usuario.setId(id);
				connectedusers.put(id, usuario);
				allusers.put(usuario.getName(), usuario);
			}
			return new ResponseEntity<>(usuario, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			//return new ResponseEntity<>(HttpStatus.I_AM_A_TEAPOT);
		}
		
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<User> actualizaUser(@PathVariable long id, @RequestBody String modo) { 
		modo = modo.replaceAll("\"", "");
		User usuario = connectedusers.get(id);
		if(usuario != null) {
			usuario.setModo(modo);
			connectedusers.put(id, usuario);
			allusers.put(usuario.getName(), usuario);
			return new ResponseEntity<>(usuario, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<User> getUser(@PathVariable long id) {

		User usuario = connectedusers.get(id);

		if (usuario != null) {
			return new ResponseEntity<>(usuario, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<User> borraItem(@PathVariable long id) {

		User usuario = connectedusers.get(id);

		if (connectedusers != null) {
			connectedusers.remove(id);
			return new ResponseEntity<>(usuario, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PutMapping("/{id}/{mode}")
	public ResponseEntity<User> sumarPartida(@PathVariable long id, @PathVariable String mode, @RequestBody String winner) { 
		winner = winner.replaceAll("\"", "");
		User usuario = connectedusers.get(id);
		if(usuario != null) {
			usuario.addPartida(mode);
			connectedusers.put(usuario.getId(), usuario);
			allusers.put(usuario.getName(), usuario);
			return new ResponseEntity<>(usuario, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/logros")
	public Collection<User> guardarDatos () throws IOException {
		PrintWriter pw = new PrintWriter ("classes/data.txt");
		Collection <User> c = new LinkedList <> ();
		for (String s : allusers.keySet()) {
			User usuario = allusers.get(s);
			c.add(usuario);
			pw.print(usuario.getId());
			pw.print(" ");
			pw.print(usuario.getName());
			int [] partidas = usuario.getPartidasjugadas();
			for(int i = 0; i < 5; i++) {
				pw.print(" ");
				pw.print(partidas[i]);
			}
			pw.println();
		}
		pw.close();
		return c;
	}
}
