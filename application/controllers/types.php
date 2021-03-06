<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Types extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $username = $this->session->userdata('username');

        if(empty($username)) redirect(site_url('users/login'));

        $user_type = $this->session->userdata('user_type');
        if($user_type != '3') redirect(site_url('errors/access_denied'));

        $this->load->model('Type_model', 'type');
    }

    public function index()
    {
        $this->layout->view('types/index_view');
    }

    public function get_list(){
        $start = $this->input->post('start');
        $stop = $this->input->post('stop');

        $start = empty($start) ? 0 : $start;
        $stop = empty($stop) ? 25 : $stop;

        $limit = (int) $stop - (int) $start;

        $result = $this->type->get_list($start, $limit);
        if($result){
            $rows = json_encode($result);
            $json = '{"success": true, "rows": '.$rows.'}';
        }else{
            $json = '{"success": false, "msg": "No result."}';
        }

        render_json($json);
    }
    public function get_list_total(){

        $total = $this->type->get_list_total();
        $json = '{"success": true, "total": '.$total.'}';

        render_json($json);
    }

    public function save(){

        $data = $this->input->post('data');

        if(empty($data)){

            $json = '{"success": false, "msg": "No data for save."}';

        }else{

            if(empty($data['name'])){

                $json = '{"success": false, "msg": "No name found."}';

            }else{

                if($data['isupdate']){

                    $rs = $this->type->update($data);

                    if($rs){
                        $json = '{"success": true}';
                    }else{
                        $json = '{"success": false, "msg": "Save error."}';
                    }

                }else{

                    $data['code'] = empty($data['code']) ? generate_serial('PRODUCT_TYPE') : $data['code'];
                    $duplicated = $this->type->check_duplicate_name($data['name']) || $this->type->check_duplicate_code($data['code']);

                    if($duplicated){

                        $json = '{"success": false, "msg": "Name/Code duplicated"}';

                    }else{

                        $rs = $this->type->save($data);

                        if($rs){

                            $json = '{"success": true}';

                        }else{

                            $json = '{"success": false, "msg": "Save error."}';

                        }
                    }
                }
            }
        }

        render_json($json);
    }

    public function remove(){
        $code = $this->input->post('code');
        if(empty($code)){
            $json = '{"success": false, "msg": "No code found."}';
        }else{
            $result = $this->type->remove($code);
            if($result){
                $json = '{"success": true}';
            }else{
                $json = '{"success": false, "msg": "Database error, please check your data."}';
            }
        }
        render_json($json);
    }

    public function search(){
        $query = $this->input->post('query');
        if(empty($query)){
            $json = '{"success": false, "msg": "No query found."}';
        }else{
            $result = $this->type->search($query);

            if($result){
                $rows = json_encode($result);
                $json = '{"success": true, "rows": '.$rows.'}';
            }else{
                $json = '{"success": false, "msg": "No result."}';
            }
        }

        render_json($json);
    }

}
