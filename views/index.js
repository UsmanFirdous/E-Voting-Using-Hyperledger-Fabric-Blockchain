<style>
  .search{
    width:400px;
    height: 30px;
    font-size: 20px;
    border-radius: 7px;
  }
  </style>
  <div>
    <form action="/search_single_candidate" method="post" style="width: 600px; background-color:#21CB65;border: none;">
      <div class="form-field">
        <input class="search" type="text" name="id" required placeholder="Enter Candidate ID">
        <button style="background-color:#fff;color:#000;text-decoration:none; border-radius: 7px; font-weight: bold;  text-align: center; padding: 6px 40px 6px 40px; " type="submit">Search</button>
      </div>
      
    </form>
  </div>
  
  <div style="float: left;font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; margin-top:-20px; ">
    
  <% for(var i=0 ; i < candidates.length; i++) { %>
    <div style="float:left; width:450px; margin-top: 60px; font-size: 16px;">
      <h4><span style="margin-right:88px; color:#FFF">Candidate ID:</span><%= candidates[i].VoterID %></h4>
      <h4><span style="margin-right:103px; color:#FFF">Party Name:</span><%= candidates[i].PartyName %></h4>
      <h4><span style="margin-right:60px; color:#FFF">Candidate Status:</span><%= candidates[i].Status %></h4>
      
    </div>
    <div style="float: left;margin-top: 25px;" >
    <img  src="<%= candidates[i].PartyMark %>" width="150" height="150"
     style="border:solid #fff;margin-left: 20px;">
    
     <form action="/candidatepicture_updated" method="post" enctype="multipart/form-data" style="width: 200px; background-color:#21CB65;border: none;">
      
        <input class="input" type="file" class="form-control" name="userPhoto" style="border-radius: 10px;margin-top:-10px;" required>
      
      <input type="hidden" name="id"  value="<%= candidates[i]._id %>">
      <button type="submit" class="btn btn-primary" style="background-color: #FFF;color:#21CB65;border-radius: 10px;">Click to Update</button>
    
    </form>
     
  
    </div>
    <div style="clear: both">
      <a style="background-color:#fff;color: crimson;text-decoration:none; border-radius: 10px; font-weight: bold;  text-align: center; padding: 8px 50px 8px 50px; " href="delete_candidate/<%= candidates[i]._id %>">Delete</a>
      <a style="background-color:#fff;color:#000;text-decoration:none; border-radius: 10px; font-weight: bold;  text-align: center; padding: 8px 50px 8px 50px; " href="Candidatedetails_updated/<%= candidates[i]._id %>">Edit Details</a>
      <hr style="margin-top: 20px;"> </div>
    <% } %>
  </div>