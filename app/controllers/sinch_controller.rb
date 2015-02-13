class SinchController < ApplicationController

	def login
		puts get_auth_ticket
		
		respond_to do |format|
    		format.json { render :json => get_auth_ticket }
 		end
	end

	def register
		puts get_auth_ticket

		respond_to do |format|
    		format.json { render :json => get_auth_ticket }
  		end
	end

	def get_auth_ticket
		user_ticket = {
			"identity" => {"type" => "username", "endpoint" => "jordanUsername"},
			"expiresIn" => 3600,
			"applicationKey" => "a5d826f0-4a0a-48a1-8f82-6e7b5c641d5a",
			"created" => Time.now.utc.iso8601
		}

		user_ticket_json = user_ticket.to_json.gsub(/\s+/, "")
		user_ticket_base64 = Base64.encode64(user_ticket_json).strip
		digest = OpenSSL::HMAC.digest(OpenSSL::Digest.new('sha256'), Base64.decode64("vYCxkSjs2k6EfguQKE8FBQ=="), user_ticket_json).strip
		signature = Base64.encode64(digest).strip
		signed_user_ticket = (user_ticket_base64 + ':' + signature).gsub(/\s+/, "")
		return {"userTicket" => signed_user_ticket}
	end
end