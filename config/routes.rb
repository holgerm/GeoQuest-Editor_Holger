GeoquestEditor::Application.routes.draw do

  get "missions/show"

  get "hotspots/update"

  resources :users
  resource :session
  resources :projects do
    resources :missions
  end

  match '/hotspots/update' => "hotspots#update", :as => "hotspots/update"
  match '/hotspots/create' => "hotspots#create", :as => "hotspots/create"
  match '/login' => "sessions#new", :as => "login"
  match '/logout' => "sessions#destroy", :as => "logout"

  match '/register' => "users#new", :as => "register"

  root :to => "welcome#index"

end