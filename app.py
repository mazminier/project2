import datetime as dt
import pandas as pd
from sqlalchemy import func
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_sqlalchemy import SQLAlchemy

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

# The database URI
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///Datasets/drinkingdriving.sqlite"

db = SQLAlchemy(app)


class Danger(db.Model):
    __tablename__ = 'CrashesDC'

    TIMESTAMP = db.Column(db.Text, primary_key=True)
    LATITUDE = db.Column(db.Text)
    LONGITUDE = db.Column(db.Text)
    FATALITIES = db.Column(db.Text)
    DRIVERSIMPAIRED = db.Column(db.Text)
    REPORT_DATE = db.Column(db.Text)
    REPORT_TIME = db.Column(db.Text)


    def __repr__(self):
        return '<CrashesDC %r>' % (self.name)

class Sunday(db.Model):
    __tablename__ = 'Sundays'

    SundayLaw = db.Column(db.Text, primary_key=True)
    Fatality = db.Column(db.Text)
    DUI = db.Column(db.Text)

    def __repr__(self):
        return '<Sundays %r>' % (self.name)


class LawEnforcement(db.Model):
    __tablename__ = 'PoliceperCapita'
    Year = db.Column(db.Text)
    State = db.Column(db.Text, primary_key=True)
    Police = db.Column(db.Text)
    Fatalities = db.Column(db.Text)
    DUI = db.Column(db.Text)

    def __repr__(self):
        return '<PoliceperCapita %r>' % (self.name)

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    """Render Home Page."""
    return render_template("index.html")


@app.route("/crash")
def crash_data():
    sel = [func.strftime("%H", Danger.TIMESTAMP), func.count(Danger.TIMESTAMP)]
    results = db.session.query(*sel).\
        group_by(func.strftime("%H", Danger.TIMESTAMP)).all()
    df = pd.DataFrame(results, columns=['hour', 'crashes'])
    return jsonify(df.to_dict(orient="records"))


    # # query for the top 10 emoji data
    # results = db.session.query(Danger.TIMESTAMP, Danger.LATITUDE, Danger.LONGITUDE, Danger.FATALITIES, Danger.DRIVERSIMPAIRED, Danger.REPORT_DATE, Danger.REPORT_TIME).\
    #     order_by(Danger.REPORT_TIME.desc()).all()
    #
    #
    # crash_data = {}
    #
    # for result in results:
    #     crash_data["Timestamp"] = result[0]
    #     crash_data["Latitude"] = result[1]
    #     crash_data["Longitude"] = result[2]
    #     crash_data["Fatalities"] = result[3]
    #     crash_data["Drivers Impaired"] = result[4]
    #     crash_data["Report Date"] = result[5]
    #     crash_data["Report Time"] = result[6]
    #
    # return jsonify(results)




@app.route("/police")
def police_data():
    """test"""

    # query for the top 10 emoji data
    results = db.session.query(LawEnforcement.State, LawEnforcement.Police, LawEnforcement.Fatalities, LawEnforcement.DUI).\
        order_by(LawEnforcement.Fatalities.desc()).all()

    # Select the top 10 query results
    police_data = {}

    for result in results:
        police_data["State"] = result[0]
        police_data["Police"] = result[1]
        police_data["Fatalities"] = result[2]
        police_data["DUI"] = result[3]
    
    df = pd.DataFrame(results, columns=['State', 'Police', 'Fatalities', 'DUI'])
    
    return jsonify(df.to_dict(orient='records'))

@app.route("/sunday")
def sunday_data():
    """test"""

    # query for the top 10 emoji data
    results = db.session.query(Sunday.SundayLaw, Sunday.Fatality, Sunday.DUI).\
        order_by(Sunday.Fatality.desc()).all()

    # Select the top 10 query results
    sunday_data = {}

    for result in results:
        sunday_data["State"] = result[0]
        sunday_data["Police"] = result[1]
        sunday_data["Fatalities"] = result[2]

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
