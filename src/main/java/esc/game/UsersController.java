package esc.game;

import java.util.Collection;
import java.util.Map;
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
	AtomicLong nextId = new AtomicLong(0);
	Map<String, User> allusers = new ConcurrentHashMap<> ();
	
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

	/*
	@PutMapping("/{id}")
	public ResponseEntity<Item> actulizaItem(@PathVariable long id, @RequestBody Item itemActualizado) {

		Item savedItem = items.get(itemActualizado.getId());

		if (savedItem != null) {

			items.put(id, itemActualizado);

			return new ResponseEntity<>(itemActualizado, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Item> getItem(@PathVariable long id) {

		Item savedItem = items.get(id);

		if (savedItem != null) {
			return new ResponseEntity<>(savedItem, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Item> borraItem(@PathVariable long id) {

		Item savedItem = items.get(id);

		if (savedItem != null) {
			items.remove(savedItem.getId());
			return new ResponseEntity<>(savedItem, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	*/
}
