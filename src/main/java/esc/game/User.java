package esc.game;

public class User {
	
	private String name;
	private long id;
	private String modo;
	private int [] partidasjugadas = new int [5];
	private boolean ishost = false;
	
	public User () {
	}
	
	public int[] getPartidasjugadas() {
		return partidasjugadas;
	}

	public void setPartidasjugadas(int[] partidasjugadas) {
		this.partidasjugadas = partidasjugadas;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public String getModo() {
		return this.modo;
	}
	
	public void setModo (String modo) {
		this.modo = modo;
	}
	
	public void addPartida(String modo) {
		if(modo.equals("Escape")) {
			partidasjugadas[0]++;
		} else if (modo.equals("Mirrored Escape")) {
			partidasjugadas[1]++;
		} else if (modo.equals("Survive")) {
			partidasjugadas[2]++;
		} else if (modo.equals("Survive Alone")) {
			partidasjugadas[3]++;
		} else if (modo.equals("Cooperate")) {
			partidasjugadas[4]++;
		}
	}
	
	public int getPartida(String mode) {
		int partidas = -1;
		if(modo.equals("Escape")) {
			partidas = partidasjugadas[0];
		} else if (modo.equals("Mirrored Escape")) {
			partidas = partidasjugadas[1];
		} else if (modo.equals("Survive")) {
			partidas = partidasjugadas[2];
		} else if (modo.equals("Survive Alone")) {
			partidas = partidasjugadas[3];
		} else if (modo.equals("Cooperate")) {
			partidas = partidasjugadas[4];
		}
		return partidas;
	}

	public boolean getIshost() {
		return ishost;
	}

	public void setIshost(boolean ishost) {
		this.ishost = ishost;
	}

}
