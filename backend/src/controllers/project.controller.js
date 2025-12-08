import Project from '../models/Project.model.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const { status, city, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (city) query['location.city'] = city;

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const projectData = {
      ...req.body,
      createdBy: req.user.id,
    };

    // Generate code if not provided
    if (!projectData.code) {
      const nameCode = projectData.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
      projectData.code = `${nameCode}-${Date.now().toString().slice(-4)}`;
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: { project },
      message: 'Project created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: { project },
      message: 'Project updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

