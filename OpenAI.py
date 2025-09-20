from flask import Flask, request, jsonify
from openai import OpenAI
from dataclasses import dataclass
from datetime import date
import json, re, random

app = Flask(__name__)
client = OpenAI(api_key="sk-....")  # cheia ta secretă

@dataclass
class Cheltuiala:
    categoria: str
    denumire_produs: str
    cantitate: str
    pret: float
    data_tranzactie: date = date.today()

CATEGORII = ["Comunale", "Tehnologii", "Transferuri", "Baruri și Restaurante",
             "Totul pentru casă", "Vestimentație și Accesorii", "Transport și Livrare",
             "Sănătate și Medicină", "Alimente și Băuturi", "Distracții"]

def proceseaza_text_smart(text):
    prompt = f"""
    Extrage toate cheltuielile din textul următor și returnează-le într-o listă JSON.
    Fiecare cheltuială să aibă câmpurile: categoria, denumire_produs, cantitate, pret.
    Categorii posibile: {CATEGORII}.
    Dacă prețul nu este menționat, generează un preț estimativ realist (cu valori zecimale) în MDL.
    Text: "{text}"
    """
    response = client.responses.create(model="gpt-4.1-mini", input=prompt, temperature=0.4)
    content = response.output[0].content[0].text.strip()
    content = re.sub(r"^```json\s*|\s*```$", "", content).strip()

    try:
        data_list = json.loads(content)
        cheltuieli = []
        for data in data_list:
            pret = data.get("pret")
            if pret is None or pret == 0:
                pret = round(random.uniform(10, 5000), 2)
            cheltuiala = Cheltuiala(
                categoria=data.get("categoria", "Necunoscut"),
                denumire_produs=data.get("denumire_produs", "Necunoscut"),
                cantitate=str(data.get("cantitate", 1)),
                pret=float(pret)
            )
            cheltuieli.append(cheltuiala)
        return cheltuieli
    except:
        return []

@app.route("/api/cheltuieli", methods=["POST"])
def api_cheltuieli():
    data = request.json
    text = data.get("text", "")
    cheltuieli = proceseaza_text_smart(text)
    # transformăm obiectele în dict-uri pentru JSON
    cheltuieli_dict = [c.__dict__ for c in cheltuieli]
    return jsonify(cheltuieli_dict)

if __name__ == "__main__":
    app.run(debug=True)
