package controllers

import elasticsearch.Repository
import play.Play
import play.api._
import play.api.mvc._
import play.api.libs.json.Json

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def activities = Action {
    val data = repository().fetchEvents()
    Ok(Json.toJson(data))
  }

  private def repository() : Repository = {
    val config = Play.application().configuration()
    val username = config.getString("es.username")
    val password = config.getString("es.password")
    val baseUrl = config.getString("es.baseUrl")
    new Repository(username, password, baseUrl)
  }
}
