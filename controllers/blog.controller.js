const { BlogModel } = require("../models/blog.model");

const addblog = async (req, res) => {
  const {userID,username,title,content,category,date,likes,comments}= req.body;
  try {
    const blog = new BlogModel({userID,username,title,content,category,date,likes,comments});
    await blog.save();
    res.status(200).send({ success: true, message: "Blog is added" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const editblog = async (req, res) => {
  const blogId = req.params.id;
  const updatedBlogData = req.body;
  const { userID } = req.body;

  try {
    const data = await BlogModel.findById(blogId); // Using findById instead of find
    if (data.userID.equals(userID)) {
      const blog = await BlogModel.findByIdAndUpdate(blogId, updatedBlogData, {
        new: true,
      });
      res.status(200).send({ success: true, message: "Blog is edited by the User" });
    } else {
      res.status(200).send({ success: true, message: "This blog was not created by you, so you are not able to edit it" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const deleteblog = async (req, res) => {
  const blogId = req.params.id;
  const { userID } = req.body;

  try {
    const data = await BlogModel.findById(blogId);
    if (data.userID.equals(userID)) {
      let loki = await BlogModel.findByIdAndDelete(blogId);
      res.status(200).send({ success: true, message: "Blog is deleted" });
    } else {
      res.status(200).send({ success: true, message: "This blog was not created by you, so you are not able to delete it" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const getblog = async (req, res) => {
  console.log(req.query);
  let { title, date, category, order } = req.query;

  try {
    // Create filter objects for the query
    const filters = {};
    if (title) {
      filters.title = new RegExp(title, 'i');
    }
    if (category) {
      filters.category = new RegExp(category, 'i');
    }
    if (date) {
      // Assuming the date parameter is in a specific format, e.g., 'YYYY-MM-DD'
      // You might need to adjust this based on your actual date format
      filters.date = new Date(date);
    }

    // Create sort object based on order parameter
    const sort = {};
    if (order === 'asc') {
      sort.date = 1;
    } else if (order === 'desc') {
      sort.date = -1;
    }

    // Use the filters and sort in the query
    const data = await BlogModel.find(filters).sort(sort);

    res.status(200).send({
      success: true,
      data: data,
      message: "All Blogs data successfully fetched"
    });

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};



const likeblog = async (req, res) => {
  const blogId = req.params.id;
try {
  const blog = await BlogModel.findByIdAndUpdate(blogId, {$inc:{likes:1}}, {
    new: true,
  })
  res.status(200).send({ success: true, message: "Blog liked successfully",data:blog });
 
} catch (error) {
  res.status(400).send({ error: error.message });
}
};


const commentblog = async (req, res) => {
  const blogId = req.params.id;
  const {username,content}=req.body;
  try {
    const blog = await BlogModel.findByIdAndUpdate(blogId, {$push:{comments:{username,content}}}, {
      new: true,
    })
    res.status(200).send({ success: true, message: "Comment added successfully",data:blog });
   
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { addblog,editblog,deleteblog,getblog,likeblog,commentblog }
